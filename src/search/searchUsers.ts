import { scFetch } from "../client/http.js";
import type { SoundCloudUser, SoundCloudPaginatedResponse } from "../types/api.js";

export const searchUsers = (token: string, query: string, pageNumber?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> =>
  scFetch({ path: `/users?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`, method: "GET", token });
