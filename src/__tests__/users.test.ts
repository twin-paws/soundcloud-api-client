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

describe("users", () => {
  it("getUser calls /users/:id", async () => {
    const fn = mockFetch({ json: { id: 42 } });
    const r = await client.users.getUser(42);
    expect(r).toEqual({ id: 42 });
    expect(fn.mock.calls[0][0]).toBe("https://api.soundcloud.com/users/42");
  });

  it("getTracks", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getTracks(42, 5);
    expect(fn.mock.calls[0][0]).toContain("/users/42/tracks?limit=5");
  });

  it("getFollowers", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getFollowers(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/followers");
  });

  it("getFollowings", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getFollowings(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/followings");
  });

  it("getPlaylists", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getPlaylists(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/playlists");
  });

  it("getLikesTracks", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getLikesTracks(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/likes/tracks");
  });

  it("getLikesPlaylists", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.users.getLikesPlaylists(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/likes/playlists");
  });

  it("getWebProfiles", async () => {
    const fn = mockFetch({ json: [{ url: "https://x.com" }] });
    await client.users.getWebProfiles(42);
    expect(fn.mock.calls[0][0]).toContain("/users/42/web-profiles");
  });
});
