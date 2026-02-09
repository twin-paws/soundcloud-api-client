import { describe, it, expect, vi, beforeEach } from "vitest";
import { SoundCloudError } from "../errors.js";
import { scFetch } from "../client/http.js";
import { mockFetch } from "./helpers.js";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("SoundCloudError", () => {
  it("has correct properties", () => {
    const err = new SoundCloudError(401, "Unauthorized", {
      error: "401 - Unauthorized",
      error_description: "Token is invalid",
    });
    expect(err.status).toBe(401);
    expect(err.statusText).toBe("Unauthorized");
    expect(err.error).toBe("401 - Unauthorized");
    expect(err.errorDescription).toBe("Token is invalid");
    expect(err.name).toBe("SoundCloudError");
    expect(err.message).toBe("Token is invalid");
  });

  it("isUnauthorized", () => {
    expect(new SoundCloudError(401, "Unauthorized").isUnauthorized).toBe(true);
    expect(new SoundCloudError(403, "Forbidden").isUnauthorized).toBe(false);
  });

  it("isForbidden", () => {
    expect(new SoundCloudError(403, "Forbidden").isForbidden).toBe(true);
  });

  it("isNotFound", () => {
    expect(new SoundCloudError(404, "Not Found").isNotFound).toBe(true);
  });

  it("isRateLimited", () => {
    expect(new SoundCloudError(429, "Too Many Requests").isRateLimited).toBe(true);
  });

  it("uses error_description for message when available", () => {
    const err = new SoundCloudError(400, "Bad Request", {
      error: "bad_request",
      error_description: "Missing parameter",
    });
    expect(err.message).toBe("Missing parameter");
  });

  it("falls back to error field for message", () => {
    const err = new SoundCloudError(400, "Bad Request", {
      error: "bad_request",
    });
    expect(err.message).toBe("bad_request");
  });

  it("falls back to status text for message", () => {
    const err = new SoundCloudError(400, "Bad Request");
    expect(err.message).toBe("400 Bad Request");
  });

  it("stores body", () => {
    const body = { error: "x", errors: [{ detail: "y" }] };
    const err = new SoundCloudError(422, "Unprocessable", body);
    expect(err.body).toEqual(body);
  });
});

describe("scFetch throws SoundCloudError", () => {
  it("throws SoundCloudError with parsed body on error response", async () => {
    mockFetch({
      status: 404,
      statusText: "Not Found",
      ok: false,
      json: { error: "not_found", error_description: "Track not found" },
    });
    try {
      await scFetch(
        { path: "/tracks/999", method: "GET", token: "tok" },
        { getToken: () => "tok", setToken: () => {}, retry: { maxRetries: 0, retryBaseDelay: 0 } },
      );
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(SoundCloudError);
      const e = err as SoundCloudError;
      expect(e.status).toBe(404);
      expect(e.errorDescription).toBe("Track not found");
      expect(e.isNotFound).toBe(true);
    }
  });
});
