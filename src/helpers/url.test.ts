import { isValidInput, determineUrlType, getTrackId } from "./url";

describe("isValidInput helper input", () => {
  test("A correct spotify link should return true", () => {
    expect(isValidInput("https://open.spotify.com/track/", "url")).toBe(true);
  });
  test("An incorrect spotify link should return false", () => {
    expect(isValidInput("https://open.spotify.com/", "url")).toBe(false);
    expect(isValidInput("https://open.spotify.com/track", "url")).toBe(false);
    expect(isValidInput("https://www.spotify.com/track", "url")).toBe(false);
    expect(isValidInput("https://www.random.com", "url")).toBe(false);
  });

  test("A correct deezer link should return true", () => {
    expect(isValidInput("https://www.deezer.com/track/", "url")).toBe(true);
  });
  test("An incorrect deezer link should return false", () => {
    expect(isValidInput("https://www.deezer.com/", "url")).toBe(false);
    expect(isValidInput("https://www.deezer.com/track", "url")).toBe(false);
    expect(isValidInput("https://open.deezer.com/track", "url")).toBe(false);
    expect(isValidInput("https://www.random.com", "url")).toBe(false);
  });

  test("A correct youtube link should return true", () => {
    expect(isValidInput("https://www.youtube.com/watch?v=test", "url")).toBe(
      true,
    );
  });
  test("An incorrect youtube link should return false", () => {
    expect(isValidInput("https://www.youtube.com/", "url")).toBe(false);
    expect(isValidInput("https://www.youtube.com/watch?t=", "url")).toBe(false);
    expect(isValidInput("https://open.youtube.com/track", "url")).toBe(false);
    expect(isValidInput("https://www.random.com", "url")).toBe(false);
  });

  test("A correct artist name should return true", () => {
    expect(isValidInput("The kooks", "artist")).toBe(true);
  });
  test("An empty string should return false", () => {
    expect(isValidInput("", "artist")).toBe(false);
  });

  test("A correct title name should return true", () => {
    expect(isValidInput("Seaside", "track")).toBe(true);
  });
  test("An empty string should return false", () => {
    expect(isValidInput("", "track")).toBe(false);
  });
});

describe("determineUrlType helper function", () => {
  test("should return 'spotify' for valid spotify url", () => {
    expect(
      determineUrlType("https://open.spotify.com/track/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe("spotify");
  });
  test("should return null for invalid spotify url", () => {
    expect(
      determineUrlType(
        "https://open.spotify.com/dasdsa/2SGBEDwsOAOAHrrdAd304i",
      ),
    ).toBe(null);
    expect(
      determineUrlType("https://www.random.com/dasdsa/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe(null);
  });

  test("should return 'spotifyApi' for valid spotify api url", () => {
    expect(
      determineUrlType(
        "https://api.spotify.com/v1/tracks/29EeS1c3ZLwDLAcmYN5DFf",
      ),
    ).toBe("spotifyApi");
  });
  test("should return null for invalid spotify api url", () => {
    expect(
      determineUrlType(
        "https://api.spotify.com/v1/dasdsa/29EeS1c3ZLwDLAcmYN5DFf",
      ),
    ).toBe(null);
    expect(
      determineUrlType("https://www.random.com/dasdsa/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe(null);
  });

  test("should return 'deezer' for valid deezer url", () => {
    expect(
      determineUrlType("https://www.deezer.com/track/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe("deezer");
  });
  test("should return null for invalid deezer url", () => {
    expect(
      determineUrlType("https://www.deezer.com/dasdsa/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe(null);
    expect(
      determineUrlType("https://www.random.com/dasdsa/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe(null);
  });

  test("should return 'youtube' for valid youtube url", () => {
    expect(
      determineUrlType(
        "https://www.youtube.com/watch?v=2SGBEDwsOAOAHrrdAd304i",
      ),
    ).toBe("youtube");
  });
  test("should return null for invalid youtube url", () => {
    expect(
      determineUrlType(
        "https://www.youtube.com/watch?t=2SGBEDwsOAOAHrrdAd304i",
      ),
    ).toBe(null);
    expect(
      determineUrlType("https://www.random.com/dasdsa/2SGBEDwsOAOAHrrdAd304i"),
    ).toBe(null);
  });
});

describe("getTrackId helper function", () => {
  test("should return valid id given valid spotify url", () => {
    expect(
      getTrackId(
        "https://open.spotify.com/track/2SGBEDwsOAOAHrrdAd304i",
        "spotify",
      ),
    ).toBe("2SGBEDwsOAOAHrrdAd304i");
  });
  test("should return null given invalid spotify url", () => {
    expect(getTrackId("https://open.spotify.com/dasdsa", "spotify")).toBe(null);
  });

  test("should return valid id given valid spotify api url", () => {
    expect(
      getTrackId(
        "https://api.spotify.com/v1/tracks/29EeS1c3ZLwDLAcmYN5DFf",
        "spotifyApi",
      ),
    ).toBe("29EeS1c3ZLwDLAcmYN5DFf");
  });
  test("should return null given invalid spotify api url", () => {
    expect(getTrackId("https://api.spotify.com/v1/dasdsa", "spotifyApi")).toBe(
      null,
    );
  });

  test("should return valid id given valid deezer url", () => {
    expect(
      getTrackId(
        "https://www.deezer.com/track/2SGBEDwsOAOAHrrdAd304i",
        "deezer",
      ),
    ).toBe("2SGBEDwsOAOAHrrdAd304i");
  });
  test("should return null given invalid deezer url", () => {
    expect(getTrackId("https://www.deezer.com/dasdsa", "spotify")).toBe(null);
  });

  test("should return valid id given valid youtube url", () => {
    expect(
      getTrackId(
        "https://www.youtube.com/watch?v=2SGBEDwsOAOAHrrdAd304i",
        "youtube",
      ),
    ).toBe("2SGBEDwsOAOAHrrdAd304i");
  });
  test("should return null given invalid youtube url", () => {
    expect(
      getTrackId(
        "https://www.youtube.com/watch?t=2SGBEDwsOAOAHrrdAd304i",
        "spotify",
      ),
    ).toBe(null);
  });
});
