import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist, PaginatedResponse } from "../types/api.js";

export const searchPlaylists = (
  token: string,
  query: string,
  pageNumber?: number
): Promise<PaginatedResponse<SoundCloudPlaylist>> => {
  return scFetch({
    path: `/playlists?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`,
    method: "GET",
    token,
  });
};
