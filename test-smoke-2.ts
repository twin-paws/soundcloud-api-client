import { SoundCloudClient } from "./src/index.js";

const client = new SoundCloudClient({
  clientId: "",
  clientSecret: "",
  redirectUri: "https://www.thesubdelta.com/sc-login",
});

async function run() {
  const token = await client.auth.getClientToken();
  client.setToken(token.access_token);
  console.log("✅ Authenticated (client_credentials)\n");

  // Use correct deadmau5 ID from search
  console.log("=== Get user 581512809 (deadmau5 from search) ===");
  try {
    const user = await client.users.getUser(581512809);
    console.log(`✅ ${user.username} — ${user.track_count} tracks, ${user.followers_count} followers`);
  } catch (e: any) {
    console.error("❌", e.message);
  }

  // Test endpoints that might need user auth
  const tests: [string, () => Promise<any>][] = [
    ["users.getTracks(581512809)", () => client.users.getTracks(581512809, 3)],
    ["users.getFollowers(581512809)", () => client.users.getFollowers(581512809, 3)],
    ["users.getFollowings(581512809)", () => client.users.getFollowings(581512809, 3)],
    ["users.getPlaylists(581512809)", () => client.users.getPlaylists(581512809, 3)],
    ["users.getLikesTracks(581512809)", () => client.users.getLikesTracks(581512809, 3)],
    ["users.getWebProfiles(581512809)", () => client.users.getWebProfiles(581512809)],
    ["tracks.getTrack(1250206453)", () => client.tracks.getTrack(1250206453)],
    ["tracks.getComments(1250206453)", () => client.tracks.getComments(1250206453, 3)],
    ["tracks.getRelated(1250206453)", () => client.tracks.getRelated(1250206453, 3)],
    ["tracks.getStreams(1250206453)", () => client.tracks.getStreams(1250206453)],
    ["tracks.getLikes(1250206453)", () => client.tracks.getLikes(1250206453, 3)],
  ];

  for (const [name, fn] of tests) {
    try {
      const result = await fn();
      const count = result?.collection?.length ?? (Array.isArray(result) ? result.length : "n/a");
      console.log(`✅ ${name} — items: ${count}`);
    } catch (e: any) {
      console.log(`❌ ${name} — ${e.message}`);
    }
  }
}

run().catch(console.error);
