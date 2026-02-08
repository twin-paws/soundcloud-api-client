import { scFetch } from "../client/http.js";
import type { SoundCloudToken } from "../types/api.js";

export const GetSCClientToken = (
  clientId: string,
  clientSecret: string
): Promise<SoundCloudToken> => {
  return scFetch<SoundCloudToken>({
    path: `/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    method: "POST",
  });
};
