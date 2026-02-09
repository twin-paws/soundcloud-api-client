import { describe, it, expect, vi, beforeEach } from "vitest";
import { SoundCloudClient } from "../client/SoundCloudClient.js";
import { mockFetch } from "./helpers.js";

beforeEach(() => { vi.restoreAllMocks(); });

describe("resolve", () => {
  it("resolveUrl calls /resolve with encoded URL", async () => {
    const fn = mockFetch({ status: 302, headers: { location: "https://api.soundcloud.com/users/123" }, ok: false });
    const client = new SoundCloudClient({ clientId: "cid", clientSecret: "cs" });
    client.setToken("tok");
    const result = await client.resolve.resolveUrl("https://soundcloud.com/deadmau5");
    expect(result).toBe("https://api.soundcloud.com/users/123");
    expect(fn.mock.calls[0][0]).toContain("/resolve?url=https%3A%2F%2Fsoundcloud.com%2Fdeadmau5");
  });
});
