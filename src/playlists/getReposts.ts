import { scFetch } from "../client/http.js";
import type { SoundCloudUser, SoundCloudPaginatedResponse } from "../types/api.js";

export const getPlaylistReposts = (token: string, playlistId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> =>
  scFetch({ path: `/playlists/${playlistId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
