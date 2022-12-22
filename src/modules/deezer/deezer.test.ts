import dotenv from "dotenv";

import { GetMusicLinksInput } from "@types";
import { DeezerApi } from "./deezer";

dotenv.config({ path: "./.env.test" });

const deezer = new DeezerApi();

describe("buildDeezerApiUrl helper", () => {
  const inputData: GetMusicLinksInput = {
    artist: "Last Train",
    track: "Fragile",
  };
  test("Should return valid URL Object", () => {
    expect(deezer.buildDeezerApiUrl(inputData)).toBeInstanceOf(URL);
  });
  test("Should return valid url", () => {
    expect(deezer.buildDeezerApiUrl(inputData).toString()).toBe(
      "https://api.deezer.com/search?q=artist%3A%22Last+Train%22+track%3A%22Fragile%22",
    );
  });
  const params = deezer.buildDeezerApiUrl(inputData).searchParams;
  test("Should have correct number of search Params", () => {
    expect([...params.keys()]).toHaveLength(1);
  });
  test("Should have valid searchParams", () => {
    expect(params.get("q")).toBe('artist:"Last Train" track:"Fragile"');
  });
});
