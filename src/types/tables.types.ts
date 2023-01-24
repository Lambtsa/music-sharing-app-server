import { UrlTypes, SearchInputType } from "@types";

export interface Search {
  id: string;
  ip: string;
  city: Nullable<string>;
  country: Nullable<string>;
  coordinates: Nullable<string>;
  timezone: Nullable<string>;
  search: string;
  search_type: SearchInputType;
  url_type: Nullable<UrlTypes>;
  created_at: Date;
  updated_at: Date;
}

export interface Artist {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Track {
  id: string;
  title: string;
  album_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Album {
  id: string;
  artist_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tables {
    searches: Search;

    tracks: Track;

    albums: Album;

    artists: Artist;
  }
}
