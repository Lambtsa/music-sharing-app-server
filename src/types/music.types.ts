export type SearchInputType = "artist" | "track" | "url";

export type MusicProviders = "spotify" | "youtube" | "deezer";

export type UrlTypes = MusicProviders | "spotifyApi";

export interface GetMusicLinksInput {
  artist: string;
  track: string;
}

export interface LinksResponseData {
  name: MusicProviders;
  url: string;
}
