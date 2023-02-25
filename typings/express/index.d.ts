import { DeezerApi, SpotifyApi, YoutubeApi } from "@external";
import Knex from "knex";
import { RedisContext } from "@core/redis";
import { DestinationStream, Logger, LoggerOptions } from "pino";

/* @see https://stackoverflow.com/a/68641378/16334980 */
declare global {
  namespace Express {
    interface RequestContext {
      db: Knex<any, unknown[]>;
      external: {
        spotify: SpotifyApi;
        deezer: DeezerApi;
        youtube: YoutubeApi;
      };
      redis: RedisContext;
      log: Logger<LoggerOptions | DestinationStream>;
    }
    interface Request {
      context: RequestContext;
    }
  }
}
