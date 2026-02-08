import { scFetch } from "../client/http.js";
import type { SoundCloudComment, PaginatedResponse } from "../types/api.js";

export const GetSCTrackComments = (
  token: string,
  trackId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudComment>> => {
  return scFetch<PaginatedResponse<SoundCloudComment>>({
    path: `/tracks/${trackId}/comments?threaded=1&filter_replies=0${limit ? `&limit=${limit}` : ""}&linked_partitioning=true`,
    method: "GET",
    token,
  });
};
