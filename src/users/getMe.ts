import { scFetch } from "../client/http.js";
import type { SoundCloudUser } from "../types/api.js";

export const getMe = (token: string): Promise<SoundCloudUser> =>
  scFetch<SoundCloudUser>({ path: "/me", method: "GET", token });
