import { SearchInputType } from "@types";

export interface AccessTokenBody {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ArtistItem {
  external_urls: {
    /* Basic Url */
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: SearchInputType;
  /* Opens application */
  uri: string;
}

export interface AlbumItem {
  album_type: "album";
  artists: ArtistItem[];
  available_markets: string[];
  external_urls: {
    /* Basic Url */
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: 15;
  type: SearchInputType;
  /* Opens application */
  uri: string;
}

export interface TrackItem {
  album: AlbumItem;
  artists: ArtistItem[];
  available_markets: [];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    /* Basic Url */
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: SearchInputType;
  /* Opens application */
  uri: string;
}

export interface TrackResponse {
  tracks: {
    href: string;
    items: TrackItem[];
    limit: number;
    next: string;
    offset: number | null;
    previous: number | null;
    total: number;
  };
}

export interface AlbumResponse {
  albums: {
    href: string;
    items: AlbumItem[];
    limit: number;
    next: string;
    offset: number | null;
    previous: number | null;
    total: number;
  };
}
