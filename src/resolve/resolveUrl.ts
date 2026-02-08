import { scFetch } from "../client/http.js";

export const resolveUrl = (token: string, url: string): Promise<string> => {
  return scFetch<string>({
    path: `/resolve?url=${encodeURIComponent(url)}`,
    method: "GET",
    token,
  });
};
