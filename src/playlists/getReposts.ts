import { scFetch } from "../client/http.js";
import type { SoundCloudUser, PaginatedResponse } from "../types/api.js";

export const getPlaylistReposts = (
  token: string,
  playlistId: string | number,
  limit?: number
): Promise<PaginatedResponse<SoundCloudUser>> => {
  return scFetch({
    path: `/playlists/${playlistId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
    method: "GET",
    token,
  });
};
