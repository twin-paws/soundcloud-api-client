// Client
export { SoundCloudClient } from "./client/SoundCloudClient.js";
export type { SoundCloudClientConfig } from "./client/SoundCloudClient.js";
export { scFetch } from "./client/http.js";
export type { RequestOptions } from "./client/http.js";

// Types
export type {
  SoundCloudToken,
  SoundCloudUser,
  SoundCloudSubscription,
  SoundCloudSubscriptionProduct,
  SoundCloudTrack,
  SoundCloudPlaylist,
  SoundCloudComment,
  SoundCloudPaginatedResponse,
} from "./types/api.js";

// Auth
export { getClientToken } from "./auth/index.js";
export { getUserToken } from "./auth/index.js";
export { refreshUserToken } from "./auth/index.js";

// Users
export { getMe } from "./users/index.js";
export { getUser } from "./users/index.js";
export { getFollowers } from "./users/index.js";
export { getFollowings } from "./users/index.js";
export { getUserTracks } from "./users/index.js";
export { getUserPlaylists } from "./users/index.js";
export { getUserLikesTracks } from "./users/index.js";
export { getUserLikesPlaylists } from "./users/index.js";

// Tracks
export { getTrack } from "./tracks/index.js";
export { getTrackComments } from "./tracks/index.js";
export { getTrackLikes } from "./tracks/index.js";
export { getTrackReposts } from "./tracks/index.js";
export { getRelatedTracks } from "./tracks/index.js";
export { likeTrack } from "./tracks/index.js";

// Playlists
export { getPlaylist } from "./playlists/index.js";
export { getPlaylistTracks } from "./playlists/index.js";
export { getPlaylistReposts } from "./playlists/index.js";

// Search
export { searchTracks } from "./search/index.js";
export { searchUsers } from "./search/index.js";
export { searchPlaylists } from "./search/index.js";

// Resolve
export { resolveUrl } from "./resolve/index.js";

// Utils
export { getSoundCloudWidgetUrl } from "./utils/index.js";
