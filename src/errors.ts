/**
 * SoundCloud API error response shape.
 * Based on actual SC API responses, e.g.:
 * {
 *   "code": 401,
 *   "message": "invalid_client",
 *   "link": "https://developers.soundcloud.com/docs/api/explorer/open-api",
 *   "status": "401 - Unauthorized",
 *   "errors": [{"error_message": "invalid_client"}],
 *   "error": null,
 *   "error_code": "invalid_client"
 * }
 */
export interface SoundCloudErrorBody {
  /** HTTP status code */
  code?: number;
  /** Error message from SC (e.g. "invalid_client", "404 - Not Found") */
  message?: string;
  /** SC status string (e.g. "401 - Unauthorized") */
  status?: string;
  /** Link to SC API docs */
  link?: string;
  /** Array of individual errors */
  errors?: Array<{ error_message?: string }>;
  /** Error field — typically null in SC responses */
  error?: string | null;
  /** Error code (e.g. "invalid_client") */
  error_code?: string;
  /** OAuth error_description (used in /oauth2/token errors) */
  error_description?: string;
}

export class SoundCloudError extends Error {
  /** HTTP status code */
  readonly status: number;
  /** HTTP status text (e.g. "Unauthorized") */
  readonly statusText: string;
  /** SC error code (e.g. "invalid_client") */
  readonly errorCode?: string;
  /** SC docs link */
  readonly docsLink?: string;
  /** Individual error messages from the errors array */
  readonly errors: string[];
  /** The full parsed response body */
  readonly body?: SoundCloudErrorBody;

  constructor(status: number, statusText: string, body?: SoundCloudErrorBody) {
    // Build the most useful message we can from SC's response
    const msg =
      body?.message ||
      body?.error_description ||
      body?.error_code ||
      body?.errors?.[0]?.error_message ||
      body?.error ||
      `${status} ${statusText}`;

    super(msg);
    this.name = "SoundCloudError";
    this.status = status;
    this.statusText = statusText;
    this.errorCode = body?.error_code ?? undefined;
    this.docsLink = body?.link ?? undefined;
    this.errors =
      body?.errors
        ?.map((e) => e.error_message)
        .filter((m): m is string => !!m) ?? [];
    this.body = body;
  }

  /** True if status is 401 Unauthorized */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** True if status is 403 Forbidden */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** True if status is 404 Not Found */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** True if status is 429 Too Many Requests */
  get isRateLimited(): boolean {
    return this.status === 429;
  }

  /** True if status is 5xx server error */
  get isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }
}
