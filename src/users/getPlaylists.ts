import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist, PaginatedResponse } from "../types/api.js";

export const GetSCUserPlaylists = (
  token: string,
  userId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudPlaylist>> => {
  return scFetch<PaginatedResponse<SoundCloudPlaylist>>({
    path: `/users/${userId}/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true&show_tracks=false`,
    method: "GET",
    token,
  });
};
