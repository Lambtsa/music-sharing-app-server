import dotenv from "dotenv";

import { GetMusicLinksInput } from "@types";
import { SpotifyApi } from "./spotify";

dotenv.config({ path: "./.env.test" });

const spotify = new SpotifyApi();

describe("buildSpotifyApiUrl helper", () => {
  const inputData: GetMusicLinksInput = {
    artist: "Last Train",
    track: "Fragile",
  };
  test("Should return valid URL Object", () => {
    expect(spotify.buildSpotifyApiUrl(inputData)).toBeInstanceOf(URL);
  });
  test("Should return valid url", () => {
    expect(spotify.buildSpotifyApiUrl(inputData).toString()).toBe(
      "https://api.spotify.com/v1/search?type=track&q=artist%3A%22Last+Train%22+track%3A%22Fragile%22",
    );
  });
  const params = spotify.buildSpotifyApiUrl(inputData).searchParams;
  test("Should have correct number of search Params", () => {
    expect([...params.keys()]).toHaveLength(2);
  });
  test("Should have valid searchParams", () => {
    expect(params.get("type")).toBe("track");
    expect(params.get("q")).toBe('artist:"Last Train" track:"Fragile"');
  });
});

describe("buildSpotifyTrackListApiUrl helper", () => {
  test("Should return valid URL Object given track", () => {
    expect(spotify.buildSpotifyTrackListApiUrl("Fragile")).toBeInstanceOf(URL);
  });
  test("Should return valid url given track", () => {
    expect(spotify.buildSpotifyTrackListApiUrl("Fragile").toString()).toBe(
      "https://api.spotify.com/v1/search?type=track&q=track%3A%22Fragile%22",
    );
  });
  const trackParams =
    spotify.buildSpotifyTrackListApiUrl("Fragile").searchParams;
  test("Should have correct number of search Params", () => {
    expect([...trackParams.keys()]).toHaveLength(2);
  });
  test("Should have valid searchParams", () => {
    expect(trackParams.get("type")).toBe("track");
    expect(trackParams.get("q")).toBe('track:"Fragile"');
  });
});

describe("buildSpotifyAlbumListApiUrl helper", () => {
  test("Should return valid URL Object given artist", () => {
    expect(spotify.buildSpotifyAlbumListApiUrl("Last Train")).toBeInstanceOf(
      URL,
    );
  });
  test("Should return valid url given artist", () => {
    expect(spotify.buildSpotifyAlbumListApiUrl("Last Train").toString()).toBe(
      "https://api.spotify.com/v1/search?type=album&q=artist%3A%22Last+Train%22",
    );
  });
  const artistParams =
    spotify.buildSpotifyAlbumListApiUrl("Last Train").searchParams;
  test("Should have correct number of search Params", () => {
    expect([...artistParams.keys()]).toHaveLength(2);
  });
  test("Should have valid searchParams", () => {
    expect(artistParams.get("type")).toBe("album");
    expect(artistParams.get("q")).toBe('artist:"Last Train"');
  });
});

describe("buildSpotifyTrackByIdApiUrl helper", () => {
  test("Should return valid URL Object given id", () => {
    expect(spotify.buildSpotifyTrackByIdApiUrl("1234")).toBeInstanceOf(URL);
  });
  test("Should return valid url given id", () => {
    expect(spotify.buildSpotifyTrackByIdApiUrl("1234").toString()).toBe(
      "https://api.spotify.com/v1/tracks/1234",
    );
  });
});

describe("buildSpotifyAlbumTracksListApiUrl helper", () => {
  test("Should return valid URL Object given id", () => {
    expect(spotify.buildSpotifyAlbumTracksListApiUrl("1234")).toBeInstanceOf(
      URL,
    );
  });
  test("Should return valid url given id", () => {
    expect(spotify.buildSpotifyAlbumTracksListApiUrl("1234").toString()).toBe(
      "https://api.spotify.com/v1/albums/1234/tracks",
    );
  });
});
