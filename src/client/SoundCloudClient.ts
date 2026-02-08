import { scFetch } from "./http.js";
import type {
  SoundCloudToken,
  SoundCloudUser,
  SoundCloudTrack,
  SoundCloudPlaylist,
  SoundCloudComment,
  PaginatedResponse,
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

    async getClientToken(): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&grant_type=client_credentials`,
        method: "POST",
      });
    }

    async getUserToken(code: string): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?grant_type=authorization_code&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&redirect_uri=${this.config.redirectUri}&code=${code}`,
        method: "POST",
      });
    }

    async refreshUserToken(refreshToken: string): Promise<SoundCloudToken> {
      return scFetch<SoundCloudToken>({
        path: `/oauth2/token?grant_type=refresh_token&client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&redirect_uri=${this.config.redirectUri}&refresh_token=${refreshToken}`,
        method: "POST",
      });
    }
  }

  export class Users {
    async getMe(token: string): Promise<SoundCloudUser> {
      return scFetch<SoundCloudUser>({ path: `/me`, method: "GET", token });
    }

    async getUser(token: string, userId: string): Promise<SoundCloudUser> {
      return scFetch<SoundCloudUser>({ path: `/users/${userId}`, method: "GET", token });
    }

    async getFollowers(token: string, userId: string, limit?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/users/${userId}/followers?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getFollowings(token: string, userId: string, limit?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/users/${userId}/followings?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getTracks(token: string, userId: string, limit?: number): Promise<PaginatedResponse<SoundCloudTrack>> {
      return scFetch<PaginatedResponse<SoundCloudTrack>>({
        path: `/users/${userId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getPlaylists(token: string, userId: string, limit?: number): Promise<PaginatedResponse<SoundCloudPlaylist>> {
      return scFetch<PaginatedResponse<SoundCloudPlaylist>>({
        path: `/users/${userId}/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true&show_tracks=false`,
        method: "GET",
        token,
      });
    }

    async getLikesTracks(token: string, userId: string, limit?: number, cursor?: string): Promise<PaginatedResponse<SoundCloudTrack>> {
      return scFetch<PaginatedResponse<SoundCloudTrack>>({
        path: `/users/${userId}/likes/tracks?${limit ? `limit=${limit}&` : ""}${cursor ? `cursor=${cursor}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getLikesPlaylists(token: string, userId: string, limit?: number): Promise<PaginatedResponse<SoundCloudPlaylist>> {
      return scFetch<PaginatedResponse<SoundCloudPlaylist>>({
        path: `/users/${userId}/likes/playlists?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }
  }

  export class Tracks {
    async getTrack(token: string, trackId: string): Promise<SoundCloudTrack> {
      return scFetch<SoundCloudTrack>({ path: `/tracks/${trackId}`, method: "GET", token });
    }

    async getComments(token: string, trackId: string, limit?: number): Promise<PaginatedResponse<SoundCloudComment>> {
      return scFetch<PaginatedResponse<SoundCloudComment>>({
        path: `/tracks/${trackId}/comments?threaded=1&filter_replies=0${limit ? `&limit=${limit}` : ""}&linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getLikes(token: string, trackId: string, limit?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/tracks/${trackId}/favoriters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getReposts(token: string, trackId: string, limit?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/tracks/${trackId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }

    async getRelated(token: string, trackId: string, limit?: number): Promise<SoundCloudTrack[]> {
      return scFetch<SoundCloudTrack[]>({
        path: `/tracks/${trackId}/related${limit ? `?limit=${limit}` : ""}`,
        method: "GET",
        token,
      });
    }

    async like(token: string, trackId: string): Promise<boolean> {
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
    }
  }

  export class Playlists {
    async getPlaylist(token: string, playlistId: string): Promise<SoundCloudPlaylist> {
      return scFetch<SoundCloudPlaylist>({ path: `/playlists/${playlistId}`, method: "GET", token });
    }

    async getTracks(token: string, playlistId: string, limit?: number, offset?: number): Promise<PaginatedResponse<SoundCloudTrack>> {
      return scFetch<PaginatedResponse<SoundCloudTrack>>({
        path: `/playlists/${playlistId}/tracks?${limit ? `limit=${limit}&` : ""}linked_partitioning=true${offset ? `&offset=${offset}` : ""}`,
        method: "GET",
        token,
      });
    }

    async getReposts(token: string, playlistId: string, limit?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/playlists/${playlistId}/reposters?${limit ? `limit=${limit}&` : ""}linked_partitioning=true`,
        method: "GET",
        token,
      });
    }
  }

  export class Search {
    async tracks(token: string, text: string, pageNumber?: number): Promise<PaginatedResponse<SoundCloudTrack>> {
      return scFetch<PaginatedResponse<SoundCloudTrack>>({
        path: `/tracks?q=${text}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`,
        method: "GET",
        token,
      });
    }

    async users(token: string, text: string, pageNumber?: number): Promise<PaginatedResponse<SoundCloudUser>> {
      return scFetch<PaginatedResponse<SoundCloudUser>>({
        path: `/users?q=${text}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`,
        method: "GET",
        token,
      });
    }

    async playlists(token: string, text: string, pageNumber?: number): Promise<PaginatedResponse<SoundCloudPlaylist>> {
      return scFetch<PaginatedResponse<SoundCloudPlaylist>>({
        path: `/playlists?q=${text}&linked_partitioning=true&limit=10${pageNumber && pageNumber > 0 ? `&offset=${10 * pageNumber}` : ""}`,
        method: "GET",
        token,
      });
    }
  }

  export class Resolve {
    async resolveUrl(token: string, url: string): Promise<string> {
      return scFetch<string>({
        path: `/resolve?url=${url}`,
        method: "GET",
        token,
      });
    }
  }
}
