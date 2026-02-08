import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist, SoundCloudPaginatedResponse } from "../types/api.js";

export const getUserLikesPlaylists = (token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist>> =>
  scFetch({ path: `/users/${userId}/likes/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
