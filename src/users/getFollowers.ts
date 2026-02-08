import { scFetch } from "../client/http.js";
import type { SoundCloudUser, PaginatedResponse } from "../types/api.js";

export const GetSCUserFollowers = (
  token: string,
  userId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudUser>> => {
  return scFetch<PaginatedResponse<SoundCloudUser>>({
    path: `/users/${userId}/followers?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
