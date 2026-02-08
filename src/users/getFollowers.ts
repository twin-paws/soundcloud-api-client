import { scFetch } from "../client/http.js";
import type { SoundCloudUser, SoundCloudPaginatedResponse } from "../types/api.js";

export const getFollowers = (token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> =>
  scFetch({ path: `/users/${userId}/followers?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
