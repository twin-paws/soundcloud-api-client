// Client
export { SoundCloudClient } from "./client/SoundCloudClient.js";
export type { SoundCloudClientConfig } from "./client/SoundCloudClient.js";

// Types
export * from "./types/index.js";

// Standalone functions — Auth
export { GetSCClientToken } from "./auth/index.js";
export { GetSCUserToken } from "./auth/index.js";
export { RefreshSCUserToken } from "./auth/index.js";

// Standalone functions — Users
export { GetSCMe } from "./users/index.js";
export { GetSCUserWithId } from "./users/index.js";
export { GetSCUserFollowers } from "./users/index.js";
export { GetSCUserFollowings } from "./users/index.js";
export { GetSCUserTracks } from "./users/index.js";
export { GetSCUserPlaylists } from "./users/index.js";
export { GetSCUserLikesTracks } from "./users/index.js";
export { GetSCUserLikesPlaylists } from "./users/index.js";

// Standalone functions — Tracks
export { GetSCTrackWithId } from "./tracks/index.js";
export { GetSCTrackComments } from "./tracks/index.js";
export { GetSCTrackLikes } from "./tracks/index.js";
export { getTrackReposts } from "./tracks/index.js";
export { getRelatedTracks } from "./tracks/index.js";
export { likeTrack } from "./tracks/index.js";

// Standalone functions — Playlists
export { getPlaylist } from "./playlists/index.js";
export { getPlaylistTracks } from "./playlists/index.js";
export { getPlaylistReposts } from "./playlists/index.js";

// Standalone functions — Search
export { searchTracks } from "./search/index.js";
export { searchUsers } from "./search/index.js";
export { searchPlaylists } from "./search/index.js";

// Standalone functions — Resolve
export { resolveUrl } from "./resolve/index.js";

// Utils
export { getSoundCloudWidgetUrl } from "./utils/index.js";
