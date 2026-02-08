import { scFetch } from "../client/http.js";
import type { SoundCloudPlaylist } from "../types/api.js";

export const getPlaylist = (token: string, playlistId: string | number): Promise<SoundCloudPlaylist> => {
  return scFetch<SoundCloudPlaylist>({ path: `/playlists/${playlistId}`, method: "GET", token });
};
