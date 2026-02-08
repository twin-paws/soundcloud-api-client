/** OAuth token response from SoundCloud */
export interface SoundCloudToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

/** SoundCloud user profile */
export interface SoundCloudUser {
  avatar_url: string;
  id: number;
  kind: string;
  permalink_url: string;
  uri: string;
  username: string;
  permalink: string;
  created_at: string;
  last_modified: string;
  first_name: string;
  last_name: string;
  full_name: string;
  city: string;
  description: string;
  country: string;
  track_count: number;
  public_favorites_count: number;
  reposts_count: number;
  followers_count: number;
  followings_count: number;
  plan: string;
  myspace_name: string | null;
  discogs_name: string | null;
  website_title: string | null;
  website: string | null;
  comments_count: number;
  online: boolean;
  likes_count: number;
  playlist_count: number;
  subscriptions: SoundCloudSubscription[];
}

export interface SoundCloudSubscription {
  product: SoundCloudSubscriptionProduct;
}

export interface SoundCloudSubscriptionProduct {
  id: string;
  name: string;
}

/** SoundCloud track */
export interface SoundCloudTrack {
  kind: string;
  id: number;
  created_at: string;
  duration: number;
  commentable: boolean;
  comment_count: number;
  sharing: string;
  tag_list: string;
  streamable: boolean;
  embeddable_by: string;
  purchase_url: string;
  purchase_title: string;
  genre: string;
  title: string;
  description: string;
  label_name: string;
  release: string | null;
  key_signature: string | null;
  isrc: string | null;
  bpm: number;
  release_year: number;
  release_month: number;
  release_day: number;
  license: string;
  uri: string;
  user: SoundCloudUser;
  permalink_url: string;
  artwork_url: string;
  stream_url: string;
  download_url: string;
  waveform_url: string;
  available_country_codes: string[] | null;
  secret_uri: string | null;
  user_favorite: boolean;
  user_playback_count: number | null;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  reposts_count: number;
  downloadable: boolean;
  access: string;
  policy: string | null;
  monetization_model: string | null;
}

/** SoundCloud playlist / set */
export interface SoundCloudPlaylist {
  duration: number;
  genre: string;
  release_day: string;
  permalink: string;
  permalink_url: string;
  release_month: string;
  release_year: string;
  description: string;
  uri: string;
  label_name: string;
  label_id: string;
  label: string;
  tag_list: string;
  track_count: number;
  user_id: number;
  last_modified: string;
  license: string;
  user: SoundCloudUser;
  playlist_type: string;
  type: string;
  id: number;
  downloadable: string;
  likes_count: number;
  sharing: string;
  created_at: string;
  release: string;
  tags: string;
  kind: string;
  title: string;
  purchase_title: string;
  ean: string;
  streamable: boolean;
  embeddable_by: string;
  artwork_url: string;
  purchase_url: string;
  tracks_uri: string;
}

/** SoundCloud comment */
export interface SoundCloudComment {
  id: string;
  user_id: string;
  track_id: string;
  created_at: string;
  body: string;
  timestamp: string;
}

/** Cursor-paginated response from SoundCloud */
export interface PaginatedResponse<T> {
  collection: T[];
  next_href: string;
}
