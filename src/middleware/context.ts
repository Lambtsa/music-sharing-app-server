import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DeezerApi, SpotifyApi, YoutubeApi } from "@external";
import {
  ContextError,
  DbConnectionError,
  RedisConnectionError,
} from "@core/errors";
import * as redis from "redis";
import { RedisClientType } from "redis";
import logger from "pino";

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

      const client: RedisClientType = redis.createClient();
      const log = logger();

      client.on("error", (error) => {
        log.error(`Error : ${error}`);
        next(new RedisConnectionError("Redis connection error"));
      });
      client.on("connect", () => log.info("Redis connected"));
      client.on("reconnecting", () => log.info("Redis reconnecting"));
      client.on("ready", () => log.info("Redis ready!"));

      await client.connect();

      const context: Express.RequestContext = {
        db,
        external: {
          spotify: new SpotifyApi(),
          deezer: new DeezerApi(),
          youtube: new YoutubeApi(),
        },
        // redis: client,
        log,
      };
      req.context = context;
      return next();
    } catch (err) {
      switch (true) {
        case err instanceof DbConnectionError: {
          console.log({ err });
          return next(new DbConnectionError("Db connection error"));
        }
        case err instanceof RedisConnectionError: {
          console.log({ err });
          return next(new RedisConnectionError("Redis connection error"));
        }
        default: {
          console.log({ err });
          return next(new ContextError("Context error"));
        }
      }
    }
  };
