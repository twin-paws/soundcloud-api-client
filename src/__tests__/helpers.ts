import { vi } from "vitest";

import type { Mock } from "vitest";

export function mockFetch(response: {
  status?: number;
  statusText?: string;
  json?: unknown;
  headers?: Record<string, string>;
  ok?: boolean;
}) {
  const status = response.status ?? 200;
  const ok = response.ok ?? (status >= 200 && status < 300);
  const headers = new Map(Object.entries(response.headers ?? {}));

  const fn = vi.fn().mockResolvedValue({
    status,
    statusText: response.statusText ?? "OK",
    ok,
    json: vi.fn().mockResolvedValue(response.json),
    headers: {
      get: (key: string) => headers.get(key.toLowerCase()) ?? null,
    },
  });

  globalThis.fetch = fn as unknown as typeof fetch;
  return fn as Mock;
}

export function mockFetchSequence(responses: Array<Parameters<typeof mockFetch>[0]>): Mock {
  let callIndex = 0;
  const fn = vi.fn().mockImplementation(() => {
    const r = responses[callIndex++] ?? responses[responses.length - 1];
    const status = r.status ?? 200;
    const ok = r.ok ?? (status >= 200 && status < 300);
    const headers = new Map(Object.entries(r.headers ?? {}));
    return Promise.resolve({
      status,
      statusText: r.statusText ?? "OK",
      ok,
      json: vi.fn().mockResolvedValue(r.json),
      headers: {
        get: (key: string) => headers.get(key.toLowerCase()) ?? null,
      },
    });
  });
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
}
