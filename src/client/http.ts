import { SoundCloudError } from "../errors.js";

const BASE_URL = "https://api.soundcloud.com";

export interface RequestOptions {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: Record<string, unknown> | FormData | URLSearchParams;
  contentType?: string;
}

export interface RetryConfig {
  /** Max retries on 429/5xx (default: 3) */
  maxRetries: number;
  /** Base delay in ms for exponential backoff (default: 1000) */
  retryBaseDelay: number;
  /** Optional debug logger */
  onDebug?: (message: string) => void;
}

export interface AutoRefreshContext {
  getToken: () => string | undefined;
  onTokenRefresh?: () => Promise<{ access_token: string; refresh_token?: string }>;
  setToken: (accessToken: string, refreshToken?: string) => void;
  retry?: RetryConfig;
}

const DEFAULT_RETRY: RetryConfig = { maxRetries: 3, retryBaseDelay: 1000 };

/** Delay helper that can be mocked/awaited */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function getRetryDelay(
  response: { status: number; headers: { get(key: string): string | null } },
  attempt: number,
  config: RetryConfig,
): number {
  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    if (retryAfter) {
      const seconds = Number(retryAfter);
      if (!Number.isNaN(seconds)) return seconds * 1000;
    }
  }
  // Exponential backoff with jitter
  const base = config.retryBaseDelay * Math.pow(2, attempt);
  return base + Math.random() * base * 0.1;
}

async function parseErrorBody(response: { json(): Promise<unknown> }): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * Make a request to the SoundCloud API using native fetch.
 * Returns parsed JSON, or for 302 redirects returns the Location header.
 */
export async function scFetch<T>(
  options: RequestOptions,
  refreshCtx?: AutoRefreshContext,
): Promise<T> {
  const retryConfig = refreshCtx?.retry ?? DEFAULT_RETRY;

  const execute = async (tokenOverride?: string): Promise<T> => {
    const url = `${BASE_URL}${options.path}`;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    const token = tokenOverride ?? options.token;
    if (token) {
      headers["Authorization"] = `OAuth ${token}`;
    }

    let fetchBody: string | FormData | URLSearchParams | undefined;
    if (options.body) {
      if (options.body instanceof URLSearchParams) {
        fetchBody = options.body;
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (options.body instanceof FormData) {
        fetchBody = options.body;
      } else {
        headers["Content-Type"] = options.contentType ?? "application/json";
        fetchBody = JSON.stringify(options.body);
      }
    } else if (options.contentType) {
      headers["Content-Type"] = options.contentType;
    }

    let lastResponse: Awaited<ReturnType<typeof fetch>> | undefined;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: fetchBody,
        redirect: "manual",
      });

      if (response.status === 302) {
        const location = response.headers.get("location");
        if (location) return location as T;
      }

      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T;
      }

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      // Don't retry 401 (handled by token refresh) or non-retryable 4xx
      if (!isRetryable(response.status)) {
        const body = await parseErrorBody(response);
        throw new SoundCloudError(response.status, response.statusText, body as any);
      }

      lastResponse = response;

      if (attempt < retryConfig.maxRetries) {
        const delayMs = getRetryDelay(response, attempt, retryConfig);
        retryConfig.onDebug?.(
          `Retry ${attempt + 1}/${retryConfig.maxRetries} after ${Math.round(delayMs)}ms (status ${response.status})`,
        );
        await delay(delayMs);
      }
    }

    // All retries exhausted
    const body = await parseErrorBody(lastResponse!);
    throw new SoundCloudError(lastResponse!.status, lastResponse!.statusText, body as any);
  };

  try {
    return await execute();
  } catch (err) {
    // Auto-refresh on 401
    if (
      refreshCtx?.onTokenRefresh &&
      err instanceof SoundCloudError &&
      err.status === 401
    ) {
      const newToken = await refreshCtx.onTokenRefresh();
      refreshCtx.setToken(newToken.access_token, newToken.refresh_token);
      return execute(newToken.access_token);
    }
    throw err;
  }
}

/**
 * Fetch an absolute URL (e.g. next_href from paginated responses).
 * Adds OAuth token if provided.
 */
export async function scFetchUrl<T>(
  url: string,
  token?: string,
  retryConfig?: RetryConfig,
): Promise<T> {
  const config = retryConfig ?? DEFAULT_RETRY;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `OAuth ${token}`;

  let lastResponse: Awaited<ReturnType<typeof fetch>> | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const response = await fetch(url, { method: "GET", headers, redirect: "manual" });

    if (response.status === 302) {
      const location = response.headers.get("location");
      if (location) return location as T;
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T;
    }

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    if (!isRetryable(response.status)) {
      const body = await parseErrorBody(response);
      throw new SoundCloudError(response.status, response.statusText, body as any);
    }

    lastResponse = response;

    if (attempt < config.maxRetries) {
      const delayMs = getRetryDelay(response, attempt, config);
      config.onDebug?.(
        `Retry ${attempt + 1}/${config.maxRetries} after ${Math.round(delayMs)}ms (status ${response.status})`,
      );
      await delay(delayMs);
    }
  }

  const body = await parseErrorBody(lastResponse!);
  throw new SoundCloudError(lastResponse!.status, lastResponse!.statusText, body as any);
}
