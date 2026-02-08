import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, PaginatedResponse } from "../types/api.js";

export const searchTracks = (
  token: string,
  query: string,
  pageNumber?: number
): Promise<PaginatedResponse<SoundCloudTrack>> => {
  return scFetch({
    path: `/tracks?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`,
    method: "GET",
    token,
  });
};
