import { scFetch } from "../client/http.js";
import type { SoundCloudTrack } from "../types/api.js";

export const getRelatedTracks = (token: string, trackId: string | number, limit?: number): Promise<SoundCloudTrack[]> =>
  scFetch<SoundCloudTrack[]>({ path: `/tracks/${trackId}/related${limit ? `?limit=${limit}` : ""}`, method: "GET", token });
