import { scFetch } from "../client/http.js";
import type { SoundCloudUser, SoundCloudPaginatedResponse } from "../types/api.js";

export const getFollowings = (token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> =>
  scFetch({ path: `/users/${userId}/followings?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
