import { scFetch } from "../client/http.js";
import type { SoundCloudToken } from "../types/api.js";

export const GetSCUserToken = (
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string
): Promise<SoundCloudToken> => {
  return scFetch<SoundCloudToken>({
    path: `/oauth2/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`,
    method: "POST",
  });
};
