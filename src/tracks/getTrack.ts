import { scFetch } from "../client/http.js";
import type { SoundCloudTrack } from "../types/api.js";

export const getTrack = (token: string, trackId: string | number): Promise<SoundCloudTrack> =>
  scFetch<SoundCloudTrack>({ path: `/tracks/${trackId}`, method: "GET", token });
