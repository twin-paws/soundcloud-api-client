import { scFetch } from "../client/http.js";
import type { SoundCloudTrack } from "../types/api.js";

export const GetSCTrackWithId = (token: string, trackId: string): Promise<SoundCloudTrack> => {
  return scFetch<SoundCloudTrack>({ path: `/tracks/${trackId}`, method: "GET", token });
};
