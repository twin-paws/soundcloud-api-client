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

describe("search", () => {
  it("tracks encodes query", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.search.tracks("hello world");
    expect(fn.mock.calls[0][0]).toContain("/tracks?q=hello%20world");
  });

  it("tracks with pagination offset", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.search.tracks("test", 2);
    expect(fn.mock.calls[0][0]).toContain("offset=20");
  });

  it("users encodes query", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.search.users("deadmau5");
    expect(fn.mock.calls[0][0]).toContain("/users?q=deadmau5");
  });

  it("playlists encodes query", async () => {
    const fn = mockFetch({ json: { collection: [] } });
    await client.search.playlists("chill");
    expect(fn.mock.calls[0][0]).toContain("/playlists?q=chill");
  });
});
