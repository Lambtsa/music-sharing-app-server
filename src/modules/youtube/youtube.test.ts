import dotenv from "dotenv";

import { GetMusicLinksInput } from "@types";
import { YoutubeApi } from "./youtube";

dotenv.config({ path: "./.env.test" });

const youtube = new YoutubeApi();

describe("buildYoutubeApiUrl helper", () => {
  const inputData: GetMusicLinksInput = {
    artist: "Last Train",
    track: "Fragile",
  };
  test("Should return valid URL Object", () => {
    expect(youtube.buildYoutubeApiUrl(inputData)).toBeInstanceOf(URL);
  });
  test("Should return valid url", () => {
    expect(youtube.buildYoutubeApiUrl(inputData).toString()).toBe(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=artist%3A%22Last+Train%22+track%3A%22Fragile%22`,
    );
  });
  const params = youtube.buildYoutubeApiUrl(inputData).searchParams;
  test("Should have correct number of search Params", () => {
    expect([...params.keys()]).toHaveLength(2);
  });
  test("Should have valid searchParams", () => {
    expect(params.get("key")).toBe(process.env.YOUTUBE_API_KEY);
    expect(params.get("q")).toBe('artist:"Last Train" track:"Fragile"');
  });
});

describe("buildYoutubeVideoUrl helper", () => {
  const inputId = "NTPcPRFg-FY";
  test("Should return valid URL Object", () => {
    expect(youtube.buildYoutubeVideoUrl(inputId)).toBeInstanceOf(URL);
  });
  test("Should return valid url", () => {
    expect(youtube.buildYoutubeVideoUrl(inputId).toString()).toBe(
      `https://www.youtube.com/watch?v=${inputId}`,
    );
  });
  const params = youtube.buildYoutubeVideoUrl(inputId).searchParams;
  test("Should have correct number of search Params", () => {
    expect([...params.keys()]).toHaveLength(1);
  });
  test("Should have valid searchParams", () => {
    expect(params.get("v")).toBe(inputId);
  });
});
