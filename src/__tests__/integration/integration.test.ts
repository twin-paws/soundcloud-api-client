import { describe, it, expect } from "vitest";
import { SoundCloudClient } from "../../client/SoundCloudClient.js";

const hasCredentials = !!process.env.SOUNDCLOUD_CLIENT_ID;
const itif = hasCredentials ? it : it.skip;

const clientId = process.env.SOUNDCLOUD_CLIENT_ID ?? "";
const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET ?? "";

describe("integration", () => {
  let client: SoundCloudClient;

  itif("getClientToken returns a real token", async () => {
    client = new SoundCloudClient({ clientId, clientSecret });
    const token = await client.auth.getClientToken();
    expect(token.access_token).toBeTruthy();
    client.setToken(token.access_token);
  });

  itif("search.tracks returns results", async () => {
    client = new SoundCloudClient({ clientId, clientSecret });
    const token = await client.auth.getClientToken();
    client.setToken(token.access_token);
    const results = await client.search.tracks("electronic");
    expect(results.collection.length).toBeGreaterThan(0);
  });

  itif("search.users returns results", async () => {
    client = new SoundCloudClient({ clientId, clientSecret });
    const token = await client.auth.getClientToken();
    client.setToken(token.access_token);
    const results = await client.search.users("deadmau5");
    expect(results.collection.length).toBeGreaterThan(0);
  });

  itif("users.getUser returns user object", async () => {
    client = new SoundCloudClient({ clientId, clientSecret });
    const token = await client.auth.getClientToken();
    client.setToken(token.access_token);
    const user = await client.users.getUser(1539304);
    expect(user.id).toBe(1539304);
  });

  itif("resolve.resolveUrl resolves a URL", async () => {
    client = new SoundCloudClient({ clientId, clientSecret });
    const token = await client.auth.getClientToken();
    client.setToken(token.access_token);
    const result = await client.resolve.resolveUrl("https://soundcloud.com/deadmau5");
    expect(result).toBeTruthy();
  });
});
