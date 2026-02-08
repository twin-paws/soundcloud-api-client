import { scFetch } from "../client/http.js";
import type { SoundCloudTrack, SoundCloudPaginatedResponse } from "../types/api.js";

export const getPlaylistTracks = (token: string, playlistId: string | number, limit?: number, offset?: number): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> =>
  scFetch({ path: `/playlists/${playlistId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true${offset ? `&offset=${offset}` : ""}`, method: "GET", token });
