import { scFetch } from "../client/http.js";
import type { SoundCloudUser } from "../types/api.js";

export const GetSCMe = (token: string): Promise<SoundCloudUser> => {
  return scFetch<SoundCloudUser>({ path: `/me`, method: "GET", token });
};
