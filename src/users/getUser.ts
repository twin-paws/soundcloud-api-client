import { scFetch } from "../client/http.js";
import type { SoundCloudUser } from "../types/api.js";

export const getUser = (token: string, userId: string | number): Promise<SoundCloudUser> =>
  scFetch<SoundCloudUser>({ path: `/users/${userId}`, method: "GET", token });
