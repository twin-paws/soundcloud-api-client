import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist, PaginatedResponse } from "../types/api.js";

export const GetSCUserLikesPlaylists = (
  token: string,
  userId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudPlaylist>> => {
  return scFetch<PaginatedResponse<SoundCloudPlaylist>>({
    path: `/users/${userId}/likes/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
