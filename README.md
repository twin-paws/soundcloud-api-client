# soundcloud-api-client

A TypeScript client for the SoundCloud API. Zero dependencies — uses native `fetch`.

## Install

```bash
npm install soundcloud-api-client
```

## Usage

### Client class

```typescript
import { SoundCloudClient } from "soundcloud-api-client";

const client = new SoundCloudClient({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "https://example.com/callback",
});

// Get a client credentials token
const token = await client.auth.getClientToken();

// Get a user
const user = await client.users.getUser(token.access_token, "12345");

// Search tracks
const results = await client.search.tracks(token.access_token, "ambient");
```

### Standalone functions

Every method is also available as a standalone function:

```typescript
import { GetSCClientToken, GetSCMe, searchTracks } from "soundcloud-api-client";

const token = await GetSCClientToken("CLIENT_ID", "CLIENT_SECRET");
const me = await GetSCMe(token.access_token);
const tracks = await searchTracks(token.access_token, "lofi");
```

## Types

All SoundCloud API response types are exported:

```typescript
import type {
  SoundCloudUser,
  SoundCloudTrack,
  SoundCloudPlaylist,
  SoundCloudComment,
  SoundCloudToken,
  PaginatedResponse,
} from "soundcloud-api-client";
```

## API Coverage

- **Auth**: Client credentials, authorization code, refresh token
- **Users**: Profile, followers, followings, tracks, playlists, likes
- **Tracks**: Get, comments, likes, reposts, related, like
- **Playlists**: Get, tracks, reposts
- **Search**: Tracks, users, playlists
- **Resolve**: URL resolution
- **Utils**: Widget URL helper

## License

MIT
