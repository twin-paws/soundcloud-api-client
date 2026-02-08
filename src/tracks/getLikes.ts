import { scFetch } from "../client/http.js";
import type { SoundCloudUser, PaginatedResponse } from "../types/api.js";

export const GetSCTrackLikes = (
  token: string,
  trackId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudUser>> => {
  return scFetch<PaginatedResponse<SoundCloudUser>>({
    path: `/tracks/${trackId}/favoriters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
