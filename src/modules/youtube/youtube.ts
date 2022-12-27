import {
  BadGatewayError,
  CustomApiErrorMessages,
  ExternalApiError,
} from "@core/errors";
import { GetMusicLinksInput } from "@types";
import fetch from "node-fetch";
import { YoutubeApiResponse } from "./youtube.types";

export class YoutubeApi {
  #searchUrl = "https://www.googleapis.com/youtube/v3/search";

  // constructor() {}

  /**
   * Builds youtube URL using base, artist and track
   * @returns Youtube API URL
   */
  buildYoutubeApiUrl({ artist, track }: GetMusicLinksInput): URL {
    const url = new URL(this.#searchUrl);
    url.searchParams.append("key", process.env.YOUTUBE_API_KEY);
    url.searchParams.append("q", `artist:"${artist}" track:"${track}"`);
    return url;
  }

  /**
   * Given an id, will return a youtube video url.
   * No testing whether id is actually valid
   * @example https://www.youtube.com/watch?v=8rNuzOUjtE8
   */
  buildYoutubeVideoUrl(id: string) {
    const youtubeUrl = new URL("https://www.youtube.com/watch");
    youtubeUrl.searchParams.append("v", id);
    return youtubeUrl;
  }

  /**
   * Youtube - Given an artist and title, this helper will return the youtube uri
   * @see https://developers.google.com/youtube/v3/docs
   * @example 'https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=artist:"aloe blacc" track:"i need a dollar"'
   */
  async searchYoutube(input: GetMusicLinksInput) {
    try {
      const youtubeUri = this.buildYoutubeApiUrl(input);

      const response = await fetch(youtubeUri.toString(), {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });

      if (!response.ok) {
        throw new ExternalApiError();
      }

      const data = (await response.json()) as YoutubeApiResponse;

      /* TODO: This will need optimising because currently only returns the first element found + need better searching */
      const track = data.items[0]?.id.videoId;

      return track
        ? this.buildYoutubeVideoUrl(track).toString()
        : CustomApiErrorMessages.NoTrack;
    } catch (err) {
      throw new BadGatewayError(err);
    }
  }

  /**
   * Helper function to get the song details from youtube API given a track id
   * @see https://developers.google.com/youtube/v3/docs/videos/list
   */
  // export const getTrackDetailsByYoutubeId = async (id: string): Promise<GetMusicLinksInput> => {
  //   const youtubeUri = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;

  //   const response = await fetch(youtubeUri, {
  //     headers: {
  //       "Content-Type": "application/json; charset=UTF-8",
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error(CustomApiErrorMessages.ExternalApiIssue);
  //   }

  //   const data = (await response.json()) as YoutubeTrackApiResponse;

  //   return {
  //     artist: data.artist.name,
  //     track: data.title
  //   }
  // }
}
