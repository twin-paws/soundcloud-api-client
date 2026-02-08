import { scFetch } from "../client/http.js";
import type { SoundCloudUser } from "../types/api.js";

export const GetSCUserWithId = (token: string, userId: string): Promise<SoundCloudUser> => {
  return scFetch<SoundCloudUser>({ path: `/users/${userId}`, method: "GET", token });
};
