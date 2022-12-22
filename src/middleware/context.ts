import { NextFunction, Request, Response } from "express";
import { DeezerApi, SpotifyApi, YoutubeApi } from "modules";

export const AddContext =
  () => (req: Request, _res: Response, next: NextFunction) => {
    const context: Express.RequestContext = {
      db: "test",
      external: {
        spotify: new SpotifyApi(),
        deezer: new DeezerApi(),
        youtube: new YoutubeApi(),
      },
    };
    req.context = context;
    return next();
  };
