import { describe, it, expect, vi, beforeEach } from "vitest";
import { SoundCloudClient } from "../client/SoundCloudClient.js";
import { mockFetch } from "./helpers.js";

const config = { clientId: "cid", clientSecret: "cs", maxRetries: 0 };
let client: SoundCloudClient;

beforeEach(() => {
  vi.restoreAllMocks();
  client = new SoundCloudClient(config);
  client.setToken("tok");
});

describe("reposts", () => {
  it("repostTrack sends POST", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.reposts.repostTrack(1);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][0]).toContain("/reposts/tracks/1");
    expect(fn.mock.calls[0][1].method).toBe("POST");
  });

  it("unrepostTrack sends DELETE", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.reposts.unrepostTrack(1);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][1].method).toBe("DELETE");
  });

  it("repostPlaylist sends POST", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.reposts.repostPlaylist(10);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][0]).toContain("/reposts/playlists/10");
  });

  it("unrepostPlaylist sends DELETE", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.reposts.unrepostPlaylist(10);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][1].method).toBe("DELETE");
  });

  it("repostTrack returns false on error", async () => {
    mockFetch({ status: 500, statusText: "Error", ok: false });
    const r = await client.reposts.repostTrack(1);
    expect(r).toBe(false);
  });
});
