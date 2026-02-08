import { scFetch } from "./http.js";
import type {
  SoundCloudToken,
  SoundCloudUser,
  SoundCloudTrack,
  SoundCloudPlaylist,
  SoundCloudComment,
  SoundCloudPaginatedResponse,
} from "../types/api.js";

export interface SoundCloudClientConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
}

export class SoundCloudClient {
  private config: SoundCloudClientConfig;

  public auth: SoundCloudClient.Auth;
  public users: SoundCloudClient.Users;
  public tracks: SoundCloudClient.Tracks;
  public playlists: SoundCloudClient.Playlists;
  public search: SoundCloudClient.Search;
  public resolve: SoundCloudClient.Resolve;

  constructor(config: SoundCloudClientConfig) {
    this.config = config;
    this.auth = new SoundCloudClient.Auth(this.config);
    this.users = new SoundCloudClient.Users();
    this.tracks = new SoundCloudClient.Tracks();
    this.playlists = new SoundCloudClient.Playlists();
    this.search = new SoundCloudClient.Search();
    this.resolve = new SoundCloudClient.Resolve();
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SoundCloudClient {
  export class Auth {
    constructor(private config: SoundCloudClientConfig) {}

    /** POST /oauth2/token — client_credentials grant */
    async getClientToken(): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&grant_type=client_credentials`,
        method: "POST",
      });
    }

    /** POST /oauth2/token — authorization_code grant */
    async getUserToken(code: string): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?grant_type=authorization_code&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&redirect_uri=${this.config.redirectUri}&code=${code}`,
        method: "POST",
      });
    }

    /** POST /oauth2/token — refresh_token grant */
    async refreshUserToken(refreshToken: string): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?grant_type=refresh_token&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&redirect_uri=${this.config.redirectUri}&refresh_token=${refreshToken}`,
        method: "POST",
      });
    }
  }

  export class Users {
    /** GET /me */
    async getMe(token: string): Promise<SoundCloudUser> {
      return scFetch<SoundCloudUser>({ path: "/me", method: "GET", token });
    }

    /** GET /users/:id */
    async getUser(token: string, userId: string | number): Promise<SoundCloudUser> {
      return scFetch<SoundCloudUser>({ path: `/users/${userId}`, method: "GET", token });
    }

    /** GET /users/:id/followers */
    async getFollowers(token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/users/${userId}/followers?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /users/:id/followings */
    async getFollowings(token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/users/${userId}/followings?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /users/:id/tracks */
    async getTracks(token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> {
      return scFetch({ path: `/users/${userId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /users/:id/playlists */
    async getPlaylists(token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist>> {
      return scFetch({ path: `/users/${userId}/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true&show_tracks=false`, method: "GET", token });
    }

    /** GET /users/:id/likes/tracks */
    async getLikesTracks(token: string, userId: string | number, limit?: number, cursor?: string): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> {
      return scFetch({ path: `/users/${userId}/likes/tracks?${limit ? `limit=${limit}&` : ""}${cursor ? `cursor=${cursor}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /users/:id/likes/playlists */
    async getLikesPlaylists(token: string, userId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist>> {
      return scFetch({ path: `/users/${userId}/likes/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }
  }

  export class Tracks {
    /** GET /tracks/:id */
    async getTrack(token: string, trackId: string | number): Promise<SoundCloudTrack> {
      return scFetch<SoundCloudTrack>({ path: `/tracks/${trackId}`, method: "GET", token });
    }

    /** GET /tracks/:id/comments */
    async getComments(token: string, trackId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudComment>> {
      return scFetch({ path: `/tracks/${trackId}/comments?threaded=1&filter_replies=0${limit ? `&limit=${limit}` : ""}&linked_partitioning=true`, method: "GET", token });
    }

    /** GET /tracks/:id/favoriters */
    async getLikes(token: string, trackId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/tracks/${trackId}/favoriters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /tracks/:id/reposters */
    async getReposts(token: string, trackId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/tracks/${trackId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }

    /** GET /tracks/:id/related */
    async getRelated(token: string, trackId: string | number, limit?: number): Promise<SoundCloudTrack[]> {
      return scFetch<SoundCloudTrack[]>({ path: `/tracks/${trackId}/related${limit ? `?limit=${limit}` : ""}`, method: "GET", token });
    }

    /** POST /likes/tracks/:id */
    async like(token: string, trackId: string | number): Promise<boolean> {
      try {
        await scFetch<unknown>({ path: `/likes/tracks/${trackId}`, method: "POST", token });
        return true;
      } catch {
        return false;
      }
    }
  }

  export class Playlists {
    /** GET /playlists/:id */
    async getPlaylist(token: string, playlistId: string | number): Promise<SoundCloudPlaylist> {
      return scFetch<SoundCloudPlaylist>({ path: `/playlists/${playlistId}`, method: "GET", token });
    }

    /** GET /playlists/:id/tracks */
    async getTracks(token: string, playlistId: string | number, limit?: number, offset?: number): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> {
      return scFetch({ path: `/playlists/${playlistId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true${offset ? `&offset=${offset}` : ""}`, method: "GET", token });
    }

    /** GET /playlists/:id/reposters */
    async getReposts(token: string, playlistId: string | number, limit?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/playlists/${playlistId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`, method: "GET", token });
    }
  }

  export class Search {
    /** GET /tracks?q= */
    async tracks(token: string, query: string, pageNumber?: number): Promise<SoundCloudPaginatedResponse<SoundCloudTrack>> {
      return scFetch({ path: `/tracks?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`, method: "GET", token });
    }

    /** GET /users?q= */
    async users(token: string, query: string, pageNumber?: number): Promise<SoundCloudPaginatedResponse<SoundCloudUser>> {
      return scFetch({ path: `/users?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`, method: "GET", token });
    }

    /** GET /playlists?q= */
    async playlists(token: string, query: string, pageNumber?: number): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist>> {
      return scFetch({ path: `/playlists?q=${encodeURIComponent(query)}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`, method: "GET", token });
    }
  }

  export class Resolve {
    /** GET /resolve?url= — resolves a SoundCloud URL to its API resource */
    async resolveUrl(token: string, url: string): Promise<string> {
      return scFetch<string>({ path: `/resolve?url=${encodeURIComponent(url)}`, method: "GET", token });
    }
  }
}
