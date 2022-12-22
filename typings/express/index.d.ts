import { DeezerApi, SpotifyApi, YoutubeApi } from "modules";

/* @see https://stackoverflow.com/a/68641378/16334980 */
declare global {
  namespace Express {
    interface RequestContext {
      db: string;
      external: {
        spotify: SpotifyApi;
        deezer: DeezerApi;
        youtube: YoutubeApi;
      };
    }
    interface Request {
      context: RequestContext;
    }
  }
}
