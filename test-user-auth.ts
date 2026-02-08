import { SoundCloudClient } from "./src/index.js";

const client = new SoundCloudClient({
  clientId: "",
  clientSecret: "",
  redirectUri: "https://www.thesubdelta.com/sc-login",
});

const code = "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiQTI1NktXIn0.uQgzDjO1G4Kpm8OrA0x02U2Cfi-dnQL5mGDstfdoqWQ0mSDN0MRpYg.HZoWFvulphyctmzeOL7dbg.0WUamuSteoaustIpi8znwQIZ8Yy29x0CSuJzzLiscPSTEGW5-RNWphhPotjJvQQB1PdBNwXktihl6LR4fkAIWJ29eyNFOCMj9Jh5UQsxcnSXyaRKgrGTjtLyOdMByqRNw08oiQuQDueSkbPwFESppAkEFxW-c6LqyKXTLWug5NqE_jxRbg0JZ79zBaQXejSS.CTKZneZyUiPt_bEyvptO8A";

async function run() {
  console.log("=== 1. Exchanging code for user token ===");
  try {
    const token = await client.auth.getUserToken(code);
    console.log("✅ User token received:", {
      access_token: token.access_token?.substring(0, 20) + "...",
      expires_in: token.expires_in,
      token_type: token.token_type,
      scope: token.scope,
      has_refresh: !!token.refresh_token,
    });
    client.setToken(token.access_token, token.refresh_token);
  } catch (e: any) {
    console.error("❌ getUserToken failed:", e.message);
    return;
  }

  console.log("\n=== 2. Get /me ===");
  try {
    const me = await client.me.getMe();
    console.log(`✅ Logged in as: ${me.username} (id: ${me.id})`);
    console.log(`   Tracks: ${me.track_count}, Followers: ${me.followers_count}, Playlists: ${me.playlist_count}`);
  } catch (e: any) {
    console.error("❌", e.message);
  }

  console.log("\n=== 3. User endpoints (deadmau5 581512809) ===");
  const userTests: [string, () => Promise<any>][] = [
    ["users.getUser", () => client.users.getUser(581512809)],
    ["users.getTracks", () => client.users.getTracks(581512809, 3)],
    ["users.getFollowers", () => client.users.getFollowers(581512809, 3)],
    ["users.getFollowings", () => client.users.getFollowings(581512809, 3)],
    ["users.getPlaylists", () => client.users.getPlaylists(581512809, 3)],
    ["users.getLikesTracks", () => client.users.getLikesTracks(581512809, 3)],
    ["users.getWebProfiles", () => client.users.getWebProfiles(581512809)],
  ];

  for (const [name, fn] of userTests) {
    try {
      const result = await fn();
      const count = result?.collection?.length ?? (Array.isArray(result) ? result.length : "single");
      console.log(`✅ ${name} — items: ${count}`);
    } catch (e: any) {
      console.log(`❌ ${name} — ${e.message}`);
    }
  }

  console.log("\n=== 4. Search + get track details ===");
  try {
    const search = await client.search.tracks("deadmau5");
    const trackId = search.collection?.[0]?.id;
    console.log(`✅ search.tracks — found ${search.collection?.length}, first id: ${trackId}`);

    if (trackId) {
      const trackTests: [string, () => Promise<any>][] = [
        ["tracks.getTrack", () => client.tracks.getTrack(trackId)],
        ["tracks.getComments", () => client.tracks.getComments(trackId, 3)],
        ["tracks.getRelated", () => client.tracks.getRelated(trackId, 3)],
        ["tracks.getStreams", () => client.tracks.getStreams(trackId)],
        ["tracks.getLikes", () => client.tracks.getLikes(trackId, 3)],
        ["tracks.getReposts", () => client.tracks.getReposts(trackId, 3)],
      ];

      for (const [name, fn] of trackTests) {
        try {
          const result = await fn();
          const count = result?.collection?.length ?? (Array.isArray(result) ? result.length : "single");
          console.log(`✅ ${name} — items: ${count}`);
        } catch (e: any) {
          console.log(`❌ ${name} — ${e.message}`);
        }
      }
    }
  } catch (e: any) {
    console.error("❌ search failed:", e.message);
  }

  console.log("\n=== 5. /me endpoints ===");
  const meTests: [string, () => Promise<any>][] = [
    ["me.getLikesTracks", () => client.me.getLikesTracks(3)],
    ["me.getLikesPlaylists", () => client.me.getLikesPlaylists(3)],
    ["me.getFollowings", () => client.me.getFollowings(3)],
    ["me.getFollowers", () => client.me.getFollowers(3)],
    ["me.getTracks", () => client.me.getTracks(3)],
    ["me.getPlaylists", () => client.me.getPlaylists(3)],
    ["me.getActivities", () => client.me.getActivities(3)],
  ];

  for (const [name, fn] of meTests) {
    try {
      const result = await fn();
      const count = result?.collection?.length ?? "n/a";
      console.log(`✅ ${name} — items: ${count}`);
    } catch (e: any) {
      console.log(`❌ ${name} — ${e.message}`);
    }
  }

  console.log("\n=== 6. Resolve ===");
  try {
    const resolved = await client.resolve.resolveUrl("https://soundcloud.com/deadmau5");
    console.log("✅ resolve:", typeof resolved === "string" ? resolved.substring(0, 80) : "object");
  } catch (e: any) {
    console.log(`❌ resolve — ${e.message}`);
  }

  console.log("\n=== Done! ===");
}

run().catch(console.error);
