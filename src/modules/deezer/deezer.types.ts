import { SearchInputType } from "@types";

interface DeezerArtist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: SearchInputType;
}

interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: SearchInputType;
}

export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: boolean;
  explicit_content_cover: boolean;
  preview: string;
  md5_image: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: SearchInputType;
}

export interface DeezerApiResponse {
  data: DeezerTrack[];
}
