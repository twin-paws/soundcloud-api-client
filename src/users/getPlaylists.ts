import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist, SoundCloudPaginatedResponse } from "../types/api.js";

export const getUserPlaylists = (token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist>> =>
  scFetch({ path: `/users/${userId}/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true&show_tracks=false`, method: "GET", token });
