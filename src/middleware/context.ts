import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DeezerApi, SpotifyApi, YoutubeApi } from "@modules";
import { DbConnectionError } from "@core/errors";

export const AddContext =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const db = await createConnection();

      /* ######################################## */
      /* Test connection */
      /* ######################################## */
      await db.raw("SELECT 1+1 as result");

      const context: Express.RequestContext = {
        db,
        external: {
          spotify: new SpotifyApi(),
          deezer: new DeezerApi(),
          youtube: new YoutubeApi(),
        },
      };
      req.context = context;
      return next();
    } catch (err) {
      next(new DbConnectionError("Db connection error"));
    }
  };
