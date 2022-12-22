import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  BadRequestError,
  CustomBaseError,
  MethodNotAllowedError,
  UnsupportedUrlError,
} from "core/errors";
import { isValidData } from "@helpers/sanitise";
import { determineUrlType, getTrackId } from "@helpers/url";
import { GetMusicLinksInput, LinksResponseData } from "@types";

const router = express.Router();

const urlSchema = z.object({
  url: z.string().url(),
});

/* Links Endpoint */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* DATA */
    /* ######################################## */
    const {
      body: { url },
    } = req;
    if (!url) {
      return next(new BadRequestError());
    }

    const { url: sanitisedUrlInput } = isValidData(
      { url } as { url: string },
      urlSchema,
    );

    const urlType = determineUrlType(sanitisedUrlInput);

    if (!urlType) {
      return next(new BadRequestError());
    }

    const trackId = getTrackId(sanitisedUrlInput, urlType);

    if (!trackId) {
      return next(new BadRequestError());
    }

    const { spotify, deezer, youtube } = req.context.external;

    let details: GetMusicLinksInput;

    switch (urlType) {
      case "spotifyApi":
      case "spotify": {
        details = await spotify.getTrackDetailsById(trackId);
        break;
      }
      case "deezer": {
        details = await deezer.getTrackDetailsByDeezerId(trackId);
        break;
      }
      case "youtube": {
        throw new UnsupportedUrlError();
      }
    }

    /* ######################################## */
    /* SPOTIFY */
    /* Use spotify to find other titles.
      /* If url passed in is spotifyesque then we can use the id directly to query api
      /* ######################################## */
    const isSpotifyId = urlType === "spotifyApi" || urlType === "spotify";
    const { url: spotifyUri } = isSpotifyId
      ? await spotify.searchSpotify(details, trackId)
      : await spotify.searchSpotify(details);

    /* ######################################## */
    /* DEEZER */
    /* ######################################## */
    const deezerUri = await deezer.searchDeezer(details);

    /* ######################################## */
    /* YOUTUBE */
    /* ######################################## */
    const youtubeUri = await youtube.searchYoutube(details);

    const response: LinksResponseData[] = [
      {
        name: "spotify",
        url: spotifyUri,
      },
      {
        name: "deezer",
        url: deezerUri,
      },
      {
        name: "youtube",
        url: youtubeUri,
      },
    ];

    res.status(200).json({
      links: response,
      details,
    });
  } catch (err) {
    console.log({ err });
    if (err instanceof CustomBaseError) {
      res.status(err.statusCode).send(err);
    } else {
      res.status(500).send(err as any);
    }
  }
});

/* Method Middleware */
router.use("/", (req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    const error = new MethodNotAllowedError();
    return next(error);
  }
});

export default router;
