import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, SoundCloudPaginatedResponse } from "../types/api.js";

export const getUserTracks = (token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> =>
  scFetch({ path: `/users/${userId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
