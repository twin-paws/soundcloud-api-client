import { scFetch } from "../client/http.js";
import type { SoundCloudUser, PaginatedResponse } from "../types/api.js";

export const GetSCUserFollowings = (
  token: string,
  userId: string,
  limit?: number
): Promise<PaginatedResponse<SoundCloudUser>> => {
  return scFetch<PaginatedResponse<SoundCloudUser>>({
    path: `/users/${userId}/followings?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
