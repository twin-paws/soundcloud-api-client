import { scFetch } from "../client/http.js";
import type { SoundCloudComment, SoundCloudPaginatedResponse } from "../types/api.js";

export const getTrackComments = (token: string, trackId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudComment>> =>
  scFetch({ path: `/tracks/${trackId}/comments?threaded=1&filter_replies=0${limit ? `&limit=${limit}` : ""}&linked_partitioning=true`, method: "GET", token });
