import { describe, it, expect } from "vitest";
import { generateCodeVerifier, generateCodeChallenge } from "../auth/pkce.js";

describe("pkce", () => {
  it("generateCodeVerifier returns base64url string", () => {
    const v = generateCodeVerifier();
    expect(v).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(v.length).toBeGreaterThan(20);
  });

  it("generateCodeChallenge returns SHA-256 hash", async () => {
    const v = generateCodeVerifier();
    const c = await generateCodeChallenge(v);
    expect(c).toMatch(/^[A-Za-z0-9_-]+$/);
    // Different verifiers produce different challenges
    const v2 = generateCodeVerifier();
    const c2 = await generateCodeChallenge(v2);
    expect(c).not.toBe(c2);
  });

  it("same verifier produces same challenge", async () => {
    const v = "test-verifier-12345";
    const c1 = await generateCodeChallenge(v);
    const c2 = await generateCodeChallenge(v);
    expect(c1).toBe(c2);
  });
});
