import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DeezerApi, SpotifyApi, YoutubeApi } from "@modules";

export const AddContext =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    const db = await createConnection();
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
  };
