import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, SoundCloudPaginatedResponse } from "../types/api.js";

export const getUserLikesTracks = (token: string, userId: string | number, limit?: number, cursor?: string): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> =>
  scFetch({ path: `/users/${userId}/likes/tracks?${limit ? `limit=${limit}&` : ""}${cursor ? `cursor=${cursor}&` : ""}linked_partitioning=true`, method: "GET", token });
