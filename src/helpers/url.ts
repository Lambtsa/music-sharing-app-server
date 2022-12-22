import {
  deezerUrlRegex,
  spotifyApiRegex,
  spotifyUrlRegex,
  youtubeUrlRegex,
} from "@constants/regex";
import { UrlTypes, SearchInputType } from "@types";

/**
 * Will determine whether the url is one of the accepted types
 * @returns boolean
 */
export const isValidMusicStreamingUrl = (url: string): boolean => {
  /* If one of these is a correct url then it will return true otherwise false */
  return (
    spotifyUrlRegex.test(url) ||
    deezerUrlRegex.test(url) ||
    youtubeUrlRegex.test(url)
  );
};

/**
 * Validates url input against expected url formats, and validates title/artist string length
 * @returns boolean
 * @example
 * isValidInput("https://open.spotify.com/track/", "url") // true
 * isValidInput("https://www.random.com/track/", "url") // false
 * isValidInput("", "artist") // false
 */
export const isValidInput = (
  input: string,
  selected: SearchInputType,
): boolean => {
  switch (selected) {
    case "artist":
    case "track": {
      // TODO: valid string to avoid urls, js,...
      return input.length >= 1;
    }
    case "url": {
      /* If one of these is a correct url then it will return true otherwise false */
      return (
        spotifyUrlRegex.test(input) ||
        deezerUrlRegex.test(input) ||
        youtubeUrlRegex.test(input)
      );
    }
  }
};

/**
 * Helper for determining which type of url has been passed into endpoint
 * @returns MusicProviders | null
 */
export const determineUrlType = (url: string): UrlTypes | null => {
  switch (true) {
    case spotifyApiRegex.test(url): {
      return "spotifyApi";
    }
    case spotifyUrlRegex.test(url): {
      return "spotify";
    }
    case deezerUrlRegex.test(url): {
      return "deezer";
    }
    case youtubeUrlRegex.test(url): {
      return "youtube";
    }
    default: {
      return null;
    }
  }
};
/**
 * Helper function to get id from the different supported urls
 * @returns string | null
 */
export const getTrackId = (url: string, type: UrlTypes): string | null => {
  const urlObj = new URL(url);
  switch (type) {
    case "spotify": {
      const pathnameArray = urlObj.pathname.split("/");
      return pathnameArray[2] || null;
    }
    case "spotifyApi": {
      const pathnameArray = urlObj.pathname.split("/");
      return pathnameArray[3] || null;
    }
    case "deezer": {
      const pathnameArray = urlObj.pathname.split("/");
      return pathnameArray[2] || null;
    }
    case "youtube": {
      return urlObj.searchParams.get("v");
    }
  }
};
