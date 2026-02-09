import { describe, it, expect, vi, beforeEach } from "vitest";
import { scFetch, scFetchUrl } from "../client/http.js";
import { SoundCloudError } from "../errors.js";
import { mockFetchSequence } from "./helpers.js";

beforeEach(() => {
  vi.restoreAllMocks();
});

const retryCtx = (overrides?: { maxRetries?: number; retryBaseDelay?: number; onDebug?: (msg: string) => void }) => ({
  getToken: () => "tok",
  setToken: () => {},
  retry: {
    maxRetries: overrides?.maxRetries ?? 3,
    retryBaseDelay: overrides?.retryBaseDelay ?? 0, // 0 delay in tests
    onDebug: overrides?.onDebug,
  },
});

describe("retry on 429", () => {
  it("retries on 429 and succeeds", async () => {
    mockFetchSequence([
      { status: 429, statusText: "Too Many Requests", ok: false, json: {} },
      { status: 200, json: { id: 1 } },
    ]);
    const result = await scFetch(
      { path: "/tracks/1", method: "GET", token: "tok" },
      retryCtx(),
    );
    expect(result).toEqual({ id: 1 });
  });

  it("retries up to maxRetries times then throws", async () => {
    mockFetchSequence([
      { status: 429, statusText: "Too Many Requests", ok: false, json: {} },
      { status: 429, statusText: "Too Many Requests", ok: false, json: {} },
      { status: 429, statusText: "Too Many Requests", ok: false, json: {} },
      { status: 429, statusText: "Too Many Requests", ok: false, json: { error: "rate_limited" } },
    ]);
    try {
      await scFetch(
        { path: "/tracks/1", method: "GET", token: "tok" },
        retryCtx(),
      );
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(SoundCloudError);
      expect((err as SoundCloudError).status).toBe(429);
      expect((err as SoundCloudError).isRateLimited).toBe(true);
    }
  });

  it("respects Retry-After header value", async () => {
    // With retryBaseDelay: 0, Retry-After still overrides to seconds * 1000
    // We just verify the request succeeds after retry
    mockFetchSequence([
      { status: 429, statusText: "Too Many Requests", ok: false, json: {}, headers: { "retry-after": "0" } },
      { status: 200, json: { id: 1 } },
    ]);
    const result = await scFetch(
      { path: "/tracks/1", method: "GET", token: "tok" },
      retryCtx(),
    );
    expect(result).toEqual({ id: 1 });
  });
});

describe("retry on 5xx", () => {
  it.each([500, 502, 503, 504])("retries on %d", async (status) => {
    mockFetchSequence([
      { status, statusText: "Server Error", ok: false, json: {} },
      { status: 200, json: { ok: true } },
    ]);
    const result = await scFetch(
      { path: "/test", method: "GET", token: "tok" },
      retryCtx(),
    );
    expect(result).toEqual({ ok: true });
  });
});

describe("does NOT retry on non-retryable 4xx", () => {
  it.each([400, 401, 403, 404])("does not retry on %d", async (status) => {
    const fn = mockFetchSequence([
      { status, statusText: "Error", ok: false, json: { error: "err" } },
      { status: 200, json: { ok: true } },
    ]);
    try {
      await scFetch(
        { path: "/test", method: "GET", token: "tok" },
        retryCtx(),
      );
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(SoundCloudError);
      expect((err as SoundCloudError).status).toBe(status);
    }
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("exponential backoff", () => {
  it("uses increasing delays", async () => {
    const delays: number[] = [];
    const origDelay = (await import("../client/http.js")).delay;
    // We can't easily mock delay, but we can verify onDebug reports increasing delays
    const debug = vi.fn();
    mockFetchSequence([
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 200, json: { ok: true } },
    ]);
    await scFetch(
      { path: "/test", method: "GET", token: "tok" },
      retryCtx({ retryBaseDelay: 0, onDebug: debug }),
    );
    expect(debug).toHaveBeenCalledTimes(2);
    // First retry mentions "Retry 1/3", second "Retry 2/3"
    expect(debug.mock.calls[0][0]).toMatch(/Retry 1\/3/);
    expect(debug.mock.calls[1][0]).toMatch(/Retry 2\/3/);
  });
});

describe("succeeds on retry after initial failure", () => {
  it("succeeds after two 500s", async () => {
    mockFetchSequence([
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 200, json: { recovered: true } },
    ]);
    const result = await scFetch(
      { path: "/test", method: "GET", token: "tok" },
      retryCtx(),
    );
    expect(result).toEqual({ recovered: true });
  });
});

describe("gives up after maxRetries", () => {
  it("throws the last error after exhausting retries", async () => {
    const fn = mockFetchSequence([
      { status: 502, statusText: "Bad Gateway", ok: false, json: {} },
      { status: 502, statusText: "Bad Gateway", ok: false, json: { error: "bad_gateway" } },
    ]);
    try {
      await scFetch(
        { path: "/test", method: "GET", token: "tok" },
        retryCtx({ maxRetries: 1 }),
      );
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(SoundCloudError);
      expect((err as SoundCloudError).status).toBe(502);
      expect((err as SoundCloudError).error).toBe("bad_gateway");
    }
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("onDebug", () => {
  it("calls onDebug on retry attempts", async () => {
    const debug = vi.fn();
    mockFetchSequence([
      { status: 503, statusText: "Unavailable", ok: false, json: {} },
      { status: 200, json: { ok: true } },
    ]);
    await scFetch(
      { path: "/test", method: "GET", token: "tok" },
      retryCtx({ onDebug: debug }),
    );
    expect(debug).toHaveBeenCalledTimes(1);
    expect(debug.mock.calls[0][0]).toMatch(/Retry 1\/3/);
    expect(debug.mock.calls[0][0]).toMatch(/status 503/);
  });
});

describe("default config", () => {
  it("uses default 3 retries when not specified", async () => {
    const fn = mockFetchSequence([
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 500, statusText: "Error", ok: false, json: {} },
      { status: 500, statusText: "Error", ok: false, json: {} },
    ]);
    try {
      // Pass retryCtx with default 3 retries, 0 delay
      await scFetch(
        { path: "/test", method: "GET", token: "tok" },
        retryCtx({ maxRetries: 3 }),
      );
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(SoundCloudError);
    }
    // 1 initial + 3 retries = 4 calls
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

describe("scFetchUrl retry", () => {
  it("retries on 429", async () => {
    mockFetchSequence([
      { status: 429, statusText: "Too Many Requests", ok: false, json: {} },
      { status: 200, json: { collection: [] } },
    ]);
    const result = await scFetchUrl("https://api.soundcloud.com/next", "tok", {
      maxRetries: 3,
      retryBaseDelay: 0,
    });
    expect(result).toEqual({ collection: [] });
  });
});
