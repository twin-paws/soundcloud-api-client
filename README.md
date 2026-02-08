# soundcloud-api-client

A TypeScript client for the SoundCloud API. Zero dependencies, uses native `fetch` (Node 18+).

## Install

```bash
npm install soundcloud-api-client
```

## Quick Start

```ts
import { SoundCloudClient } from "soundcloud-api-client";

const sc = new SoundCloudClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  redirectUri: "https://yourapp.com/callback",
});

// Get a client token
const token = await sc.auth.getClientToken();

// Search for tracks
const results = await sc.search.tracks(token.access_token, "electronic");
console.log(results.collection);

// Get a user
const user = await sc.users.getMe(token.access_token);

// Get a track and its comments
const track = await sc.tracks.getTrack(token.access_token, 123456);
const comments = await sc.tracks.getComments(token.access_token, 123456);
```

## Client Class

The `SoundCloudClient` class organizes all endpoints into namespaces:

```ts
const sc = new SoundCloudClient({ clientId, clientSecret, redirectUri });

// Auth
sc.auth.getClientToken()
sc.auth.getUserToken(code)
sc.auth.refreshUserToken(refreshToken)

// Users
sc.users.getMe(token)
sc.users.getUser(token, userId)
sc.users.getFollowers(token, userId, limit?)
sc.users.getFollowings(token, userId, limit?)
sc.users.getTracks(token, userId, limit?)
sc.users.getPlaylists(token, userId, limit?)
sc.users.getLikesTracks(token, userId, limit?, cursor?)
sc.users.getLikesPlaylists(token, userId, limit?)

// Tracks
sc.tracks.getTrack(token, trackId)
sc.tracks.getComments(token, trackId, limit?)
sc.tracks.getLikes(token, trackId, limit?)
sc.tracks.getReposts(token, trackId, limit?)
sc.tracks.getRelated(token, trackId, limit?)
sc.tracks.like(token, trackId)

// Playlists
sc.playlists.getPlaylist(token, playlistId)
sc.playlists.getTracks(token, playlistId, limit?, offset?)
sc.playlists.getReposts(token, playlistId, limit?)

// Search
sc.search.tracks(token, query, pageNumber?)
sc.search.users(token, query, pageNumber?)
sc.search.playlists(token, query, pageNumber?)

// Resolve
sc.resolve.resolveUrl(token, url)
```

## Standalone Functions

Every endpoint is also available as a standalone function:

```ts
import { getMe, searchTracks, getClientToken } from "soundcloud-api-client";

const token = await getClientToken("clientId", "clientSecret");
const me = await getMe(token.access_token);
const tracks = await searchTracks(token.access_token, "lo-fi");
```

## Types

All response types match the SoundCloud API exactly:

```ts
import type {
  SoundCloudUser,
  SoundCloudTrack,
  SoundCloudPlaylist,
  SoundCloudComment,
  SoundCloudToken,
  SoundCloudPaginatedResponse,
} from "soundcloud-api-client/types";
```

## OAuth Flow

```ts
const sc = new SoundCloudClient({
  clientId: "...",
  clientSecret: "...",
  redirectUri: "https://yourapp.com/callback",
});

// 1. Redirect user to SoundCloud authorization page
// 2. Exchange the code for a token
const token = await sc.auth.getUserToken(code);

// 3. Use the token
const me = await sc.users.getMe(token.access_token);

// 4. Refresh when expired
const refreshed = await sc.auth.refreshUserToken(token.refresh_token);
```

## Pagination

Paginated endpoints return `SoundCloudPaginatedResponse<T>`:

```ts
interface SoundCloudPaginatedResponse<T> {
  collection: T[];
  next_href: string; // URL for next page
}
```

## Utilities

```ts
import { getSoundCloudWidgetUrl } from "soundcloud-api-client";

// Generate a SoundCloud embed widget URL
const widgetUrl = getSoundCloudWidgetUrl(trackId);
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- SoundCloud API credentials

## License

MIT
