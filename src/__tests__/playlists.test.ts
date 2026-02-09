import { describe, it, expect, vi, beforeEach } from "vitest";
import { SoundCloudClient } from "../client/SoundCloudClient.js";
import { mockFetch } from "./helpers.js";

const config = { clientId: "cid", clientSecret: "cs" };
let client: SoundCloudClient;

beforeEach(() => {
  vi.restoreAllMocks();
  client = new SoundCloudClient(config);
  client.setToken("tok");
});

describe("playlists", () => {
  it("getPlaylist", async () => {
    const fn = mockFetch({ json: { id: 10 } });
    await client.playlists.getPlaylist(10);
    expect(fn.mock.calls[0][0]).toContain("/playlists/10");
    expect(fn.mock.calls[0][1].method).toBe("GET");
  });

  it("getTracks", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.playlists.getTracks(10);
    expect(fn.mock.calls[0][0]).toContain("/playlists/10/tracks");
  });

  it("getReposts", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.playlists.getReposts(10);
    expect(fn.mock.calls[0][0]).toContain("/playlists/10/reposters");
  });

  it("create sends POST", async () => {
    const fn = mockFetch({ json: { id: 11, title: "My Playlist" } });
    await client.playlists.create({ title: "My Playlist" });
    expect(fn.mock.calls[0][1].method).toBe("POST");
    expect(fn.mock.calls[0][0]).toContain("/playlists");
    expect(JSON.parse(fn.mock.calls[0][1].body)).toEqual({ playlist: { title: "My Playlist" } });
  });

  it("update sends PUT", async () => {
    const fn = mockFetch({ json: { id: 10 } });
    await client.playlists.update(10, { title: "Updated" });
    expect(fn.mock.calls[0][1].method).toBe("PUT");
    expect(JSON.parse(fn.mock.calls[0][1].body)).toEqual({ playlist: { title: "Updated" } });
  });

  it("delete sends DELETE", async () => {
    const fn = mockFetch({ status: 204 });
    await client.playlists.delete(10);
    expect(fn.mock.calls[0][1].method).toBe("DELETE");
    expect(fn.mock.calls[0][0]).toContain("/playlists/10");
  });
});
