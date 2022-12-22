export interface AccessTokenBody {
  access_token: string;
  token_type: string;
  expires_in: number;
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
