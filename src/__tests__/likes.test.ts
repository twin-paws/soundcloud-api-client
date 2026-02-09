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

describe("likes", () => {
  it("likeTrack sends POST", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.likes.likeTrack(1);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][0]).toContain("/likes/tracks/1");
    expect(fn.mock.calls[0][1].method).toBe("POST");
  });

  it("unlikeTrack sends DELETE", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.likes.unlikeTrack(1);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][1].method).toBe("DELETE");
  });

  it("likePlaylist sends POST", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.likes.likePlaylist(10);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][0]).toContain("/likes/playlists/10");
    expect(fn.mock.calls[0][1].method).toBe("POST");
  });

  it("unlikePlaylist sends DELETE", async () => {
    const fn = mockFetch({ status: 204 });
    const r = await client.likes.unlikePlaylist(10);
    expect(r).toBe(true);
    expect(fn.mock.calls[0][1].method).toBe("DELETE");
  });

  it("likeTrack returns false on error", async () => {
    mockFetch({ status: 500, statusText: "Error", ok: false });
    const r = await client.likes.likeTrack(1);
    expect(r).toBe(false);
  });
});
