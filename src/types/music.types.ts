export type SearchInputType = "artist" | "track" | "url";

export type MusicProviders = "spotify" | "youtube" | "deezer";

export type UrlTypes = MusicProviders | "spotifyApi";

export interface GetMusicLinksInput {
  artist: string;
  track: string;
  album: string;
}

export interface LinksResponseData {
  name: MusicProviders;
  url: string;
}

export interface SearchSpotifyReturnType {
  input: {
    artist: string;
    track: string;
  };
  url: string;
}

export interface ListOfTracksReturnType {
  tracks: {
    id: string;
    artist: string;
    track: string;
    album: string;
    url: string;
    imageUrl: string | undefined;
  }[];
}

export interface ListOfAlbumsReturnType {
  albums: {
    id: string;
    artist: string;
    album: string;
    imageUrl: string | undefined;
    tracks: {
      id: string;
      artist: string;
      track: string;
      url: string;
    }[];
  }[];
}
