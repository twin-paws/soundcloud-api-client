import { scFetch } from "../client/http.js";
import type { SoundCloudUser, PaginatedResponse } from "../types/api.js";

export const getTrackReposts = (
  token: string,
  trackId: string | number,
  limit?: number
): Promise<PaginatedResponse<SoundCloudUser>> => {
  return scFetch({
    path: `/tracks/${trackId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
