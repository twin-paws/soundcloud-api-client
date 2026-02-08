import { scFetch } from "../client/http.js";

export const likeTrack = async (
  token: string,
  trackId: string | number
): Promise<boolean> => {
  try {
    await scFetch<unknown>({
      path: `/likes/tracks/${trackId}`,
      method: "POST",
      token,
    });
    return true;
  } catch {
    return false;
  }
};
