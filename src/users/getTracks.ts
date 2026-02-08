import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, PaginatedResponse } from "../types/api.js";

export const GetSCUserTracks = (
  token: string,
  userId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudTrack>> => {
  return scFetch<PaginatedResponse<SoundCloudTrack>>({
    path: `/users/${userId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
