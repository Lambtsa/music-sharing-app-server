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
