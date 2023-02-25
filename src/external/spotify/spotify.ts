import {
  GetMusicLinksInput,
  ListOfAlbumsReturnType,
  ListOfTracksReturnType,
  SearchSpotifyReturnType,
} from "@types";
import {
  ExternalApiError,
  BadGatewayError,
  BadRequestError,
  TrackNotFoundError,
} from "@core/errors";
import fetch from "node-fetch";
import {
  AccessTokenBody,
  AlbumResponse,
  TrackItem,
  TrackResponse,
} from "./spotify.api.types";
import { RedisContext } from "@core/redis";

export class SpotifyApi {
  #tokenUrl = "https://accounts.spotify.com/api/token";
  #searchUrl = "https://api.spotify.com/v1/search";
  #redis: RedisContext;

  constructor(redis: RedisContext) {
    this.#redis = redis;
  }

  /**
   * Encodes in base64 the clientId:clientSecret for use with spotify API
   * @returns base64 encoded client_id:client_secret
   */
  encodeBearer(): string {
    const data = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedString = Buffer.from(data).toString("base64");
    return `Basic ${encodedString}`;
  }

  /**
   * Before querying the API, this helper will request an access_token
   * @returns access_token
   * @see https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
   */
  async getAccessToken(): Promise<string> {
    try {
      const auth = this.encodeBearer();

      const tokenIdentifier = "spotify:access:token";
      const cachedToken = await this.#redis.client.get(tokenIdentifier);

      if (cachedToken) {
        return JSON.parse(cachedToken);
      } else {
        const response = await fetch(this.#tokenUrl, {
          method: "POST",
          headers: {
            Authorization: auth,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: "grant_type=client_credentials",
        });

        if (!response.ok) {
          throw new BadGatewayError();
        }

        const body = (await response.json()) as AccessTokenBody;

        await this.#redis.client.set(
          tokenIdentifier,
          JSON.stringify(body.access_token),
          {
            EX: 3600,
            NX: true,
          },
        );

        return body.access_token;
      }
    } catch (err) {
      throw new BadGatewayError(err);
    }
  }

  /**
   * Builds spotify URL using base, artist and track
   * @returns Spotify API URL
   */
  buildSpotifyApiUrl({
    artist,
    track,
  }: Pick<GetMusicLinksInput, "artist" | "track">) {
    const url = new URL(this.#searchUrl);
    url.searchParams.append("type", "track");
    url.searchParams.append("q", `artist:"${artist}" track:"${track}"`);
    return url;
  }

  /**
   * Builds spotify URL for querying track using id
   * @returns Spotify API URL
   */
  buildSpotifyTrackByIdApiUrl(id: string) {
    const url = new URL(`https://api.spotify.com/v1/tracks/${id}`);
    return url;
  }

  /**
   * Builds spotify URL for querying all tracks by name
   * @returns Spotify API URL
   */
  buildSpotifyTrackListApiUrl(track: string) {
    const url = new URL(this.#searchUrl);
    url.searchParams.append("type", "track");
    url.searchParams.append("q", `track:"${track}"`);
    return url;
  }

  /**
   * Builds spotify URL for querying all albums by artist
   * @returns Spotify API URL
   */
  buildSpotifyAlbumListApiUrl(artist: string) {
    const url = new URL(this.#searchUrl);
    url.searchParams.append("type", "album");
    url.searchParams.append("q", `artist:"${artist}"`);
    return url;
  }

  /**
   * Builds spotify URL for querying all albums by artist
   * @returns Spotify API URL
   */
  buildSpotifyAlbumTracksListApiUrl(id: string) {
    const url = new URL(`https://api.spotify.com/v1/albums/${id}/tracks`);
    return url;
  }

  /**
   * Given an artist and title, this helper will return the spotify uri, artist and title
   * We use the spotify API to get stable artist and title because it seems to be the best search so far
   * @returns spotify uri and input
   * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/search
   */
  async searchSpotify(
    input: Pick<GetMusicLinksInput, "artist" | "track">,
    spotifyId?: string,
  ): Promise<SearchSpotifyReturnType> {
    try {
      const accessToken = await this.getAccessToken();

      if (spotifyId) {
        /* Will return TrackItem response */
        const spotifyUrl = this.buildSpotifyTrackByIdApiUrl(spotifyId);

        const response = await fetch(spotifyUrl.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new ExternalApiError();
        }

        const data = (await response.json()) as TrackItem;

        if (!data.artists[0]) {
          throw new TrackNotFoundError();
        }

        return {
          input: {
            artist: data.artists[0].name,
            track: data.name,
          },
          url: data.external_urls.spotify,
        };
      } else {
        /* Will return TrackResponse response */
        const spotifyUrl = this.buildSpotifyApiUrl(input);

        const response = await fetch(spotifyUrl.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new ExternalApiError();
        }

        const data = (await response.json()) as TrackResponse;

        /* TODO: This will need optimising because currently only returns the first element found + need better searching */
        const track = data.tracks.items.find((item) =>
          item.name.toLowerCase().includes(input.track.toLowerCase()),
        );

        if (!track || !track.artists[0]) {
          throw new TrackNotFoundError();
        }

        return {
          input: {
            artist: track.artists[0].name,
            track: track.name,
          },
          url: track.external_urls.spotify,
        };
      }
    } catch (err) {
      /* TODO: check that these catches don't change the error */
      throw new BadGatewayError(err);
    }
  }

  /**
   * Helper function to get the song details from spotify API given a track id
   * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-track
   */
  async getTrackDetailsById(id: string): Promise<GetMusicLinksInput> {
    try {
      const accessToken = await this.getAccessToken();
      const spotifyUrl = `https://api.spotify.com/v1/tracks/${id}`;

      const response = await fetch(spotifyUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        switch (response.status) {
          case 500: {
            throw new ExternalApiError();
          }
          case 400: {
            throw new BadRequestError();
          }
          case 404: {
            throw new TrackNotFoundError();
          }
        }
      }

      const data = (await response.json()) as TrackItem;

      return {
        artist: data.artists[0]?.name || "No artist",
        track: data.name,
        albumName: data.album.name,
      };
    } catch (err) {
      throw new BadGatewayError(err);
    }
  }

  /**
   * Given an artist or a track this helper will return a list of the songs
   * @returns spotify uri and input
   * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/search
   */
  async getListOfSongsByTrack(track: string): Promise<ListOfTracksReturnType> {
    try {
      const accessToken = await this.getAccessToken();

      const spotifyUrl = this.buildSpotifyTrackListApiUrl(track);

      const response = await fetch(spotifyUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ExternalApiError();
      }

      const data = (await response.json()) as TrackResponse;

      if (!data.tracks.items.length) {
        throw new TrackNotFoundError();
      }

      return {
        tracks: data.tracks.items.map((item) => ({
          id: item.id,
          artist: item.album.artists[0]?.name || "Artist unknown",
          track: item.name,
          url: item.href,
          album: item.album.name,
          imageUrl: item.album.images.find((image) => image.height === 300)
            ?.url,
        })),
      };
    } catch (err) {
      throw new BadGatewayError(err);
    }
  }

  /**
   * Given an artist or a track this helper will return a list of the songs
   * @returns spotify uri and input
   * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/search
   */
  async getListOfAlbumsByArtist(
    artist: string,
  ): Promise<ListOfAlbumsReturnType> {
    try {
      const accessToken = await this.getAccessToken();

      const spotifyUrl = this.buildSpotifyAlbumListApiUrl(artist);

      const response = await fetch(spotifyUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ExternalApiError();
      }

      const { albums: albumData } = (await response.json()) as AlbumResponse;

      if (!albumData.items.length) {
        throw new TrackNotFoundError();
      }

      const albums = await Promise.all(
        albumData.items.map(async (album) => {
          const spotifyUrl = this.buildSpotifyAlbumTracksListApiUrl(album.id);
          const response = await fetch(spotifyUrl.toString(), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new ExternalApiError();
          }
          const trackdata = (await response.json()) as TrackResponse["tracks"];

          return {
            id: album.id,
            artist: album.artists[0]?.name || "Artist unknown",
            album: album.name,
            imageUrl: album.images.find((image) => image.height === 300)?.url,
            tracks: trackdata.items.map((track) => ({
              id: track.id,
              artist: album.artists[0]?.name || "Artist unknown",
              track: track.name,
              url: track.href,
            })),
          };
        }),
      );

      return {
        albums,
      };
    } catch (err) {
      throw new BadGatewayError(err);
    }
  }
}
