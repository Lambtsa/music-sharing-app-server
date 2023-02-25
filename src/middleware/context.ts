import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DeezerApi, SpotifyApi, YoutubeApi } from "@external";
import {
  ContextError,
  DbConnectionError,
  RedisConnectionError,
} from "@core/errors";
import logger from "pino";
import { RedisContext } from "@core/redis";

/**
 * Adds context to each request allowing access to external classes and db connection
 */
export const AddContext =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const db = await createConnection();

      /* ######################################## */
      /* Test connection */
      /* ######################################## */
      await db.raw("SELECT 1+1 as result");

      const log = logger();

      const client = new RedisContext(log);
      await client.connect();

      const context: Express.RequestContext = {
        db,
        external: {
          spotify: new SpotifyApi(client),
          deezer: new DeezerApi(),
          youtube: new YoutubeApi(),
        },
        redis: client,
        log,
      };
      req.context = context;
      return next();
    } catch (err) {
      switch (true) {
        case err instanceof DbConnectionError: {
          return next(new DbConnectionError("Db connection error"));
        }
        case err instanceof RedisConnectionError: {
          return next(new RedisConnectionError("Redis connection error"));
        }
        default: {
          return next(new ContextError("Context error"));
        }
      }
    }
  };
