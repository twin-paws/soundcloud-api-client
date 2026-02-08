import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, PaginatedResponse } from "../types/api.js";

export const GetSCUserLikesTracks = (
  token: string,
  userId: string,
  limit?: number,
  cursor?: string
): Promise<PaginatedResponse<SoundCloudTrack>> => {
  return scFetch<PaginatedResponse<SoundCloudTrack>>({
    path: `/users/${userId}/likes/tracks?${limit ? `limit=${limit}&` : ""}${cursor ? `cursor=${cursor}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
