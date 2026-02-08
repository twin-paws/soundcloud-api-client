import { scFetch } from "../client/http.js";
import type { SoundCloudUser, SoundCloudPaginatedResponse } from "../types/api.js";

export const getTrackReposts = (token: string, trackId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> =>
  scFetch({ path: `/tracks/${trackId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
