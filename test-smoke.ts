import { SoundCloudClient } from "./src/index.js";

const client = new SoundCloudClient({
  clientId: "",
  clientSecret: "",
  redirectUri: "https://www.thesubdelta.com/sc-login",
});

async function run() {
  console.log("=== 1. Getting client token ===");
  try {
    const token = await client.auth.getClientToken();
    console.log("✅ Token received:", {
      access_token: token.access_token?.substring(0, 20) + "...",
      expires_in: token.expires_in,
      token_type: token.token_type,
      scope: token.scope,
    });
    client.setToken(token.access_token);
  } catch (e: any) {
    console.error("❌ getClientToken failed:", e.message);
    return;
  }

  console.log("\n=== 2. Search tracks ===");
  try {
    const results = await client.search.tracks("lofi beats");
    console.log(`✅ Found ${results.collection?.length} tracks`);
    if (results.collection?.[0]) {
      const t = results.collection[0];
      console.log(`   First: "${t.title}" by ${t.user?.username} (id: ${t.id})`);
    }
    console.log(`   next_href: ${results.next_href ? "present" : "none"}`);
  } catch (e: any) {
    console.error("❌ search.tracks failed:", e.message);
  }

  console.log("\n=== 3. Search users ===");
  try {
    const results = await client.search.users("deadmau5");
    console.log(`✅ Found ${results.collection?.length} users`);
    if (results.collection?.[0]) {
      const u = results.collection[0];
      console.log(`   First: "${u.username}" (id: ${u.id}, followers: ${u.followers_count})`);
    }
  } catch (e: any) {
    console.error("❌ search.users failed:", e.message);
  }

  console.log("\n=== 4. Get user by ID ===");
  try {
    const user = await client.users.getUser(7587685); // deadmau5
    console.log(`✅ User: ${user.username} — ${user.track_count} tracks, ${user.followers_count} followers`);
  } catch (e: any) {
    console.error("❌ users.getUser failed:", e.message);
  }

  console.log("\n=== 5. Get user tracks ===");
  try {
    const tracks = await client.users.getTracks(7587685, 3);
    console.log(`✅ Got ${tracks.collection?.length} tracks`);
    tracks.collection?.forEach((t: any) => console.log(`   - "${t.title}" (${t.playback_count} plays)`));
  } catch (e: any) {
    console.error("❌ users.getTracks failed:", e.message);
  }

  console.log("\n=== 6. Resolve URL ===");
  try {
    const resolved = await client.resolve.resolveUrl("https://soundcloud.com/deadmau5");
    console.log("✅ Resolved:", typeof resolved === "string" ? resolved : JSON.stringify(resolved).substring(0, 100));
  } catch (e: any) {
    console.error("❌ resolve failed:", e.message);
  }

  console.log("\n=== 7. Get authorization URL ===");
  const authUrl = client.auth.getAuthorizationUrl({ state: "test123" });
  console.log("✅ Auth URL:", authUrl);

  console.log("\n=== 8. Search playlists ===");
  try {
    const results = await client.search.playlists("chill vibes");
    console.log(`✅ Found ${results.collection?.length} playlists`);
    if (results.collection?.[0]) {
      const p = results.collection[0];
      console.log(`   First: "${p.title}" by ${p.user?.username} (${p.track_count} tracks)`);
    }
  } catch (e: any) {
    console.error("❌ search.playlists failed:", e.message);
  }

  console.log("\n=== Done! ===");
}

run().catch(console.error);
