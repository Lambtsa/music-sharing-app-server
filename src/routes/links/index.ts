import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";

import {
  BadRequestError,
  MethodNotAllowedError,
  UnsupportedUrlError,
} from "core/errors";
import { isValidData } from "@helpers/sanitise";
import { determineUrlType, getTrackId } from "@helpers/url";
import { GetMusicLinksInput, LinksResponseData, UserDataInput } from "@types";
import { Search } from "db/tables.types";
import { Knex } from "knex";

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
      body: { url, user },
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

    const {
      db,
      external: { spotify, deezer, youtube },
    } = req.context;

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
    /* Save Data to DB */
    /* ######################################## */
    if (!!user && !!user.ip && !!user.geolocation) {
      /* TODO: Add transaction */
      const { ip, geolocation } = user as UserDataInput;
      await db.transaction(async (trx: Knex.Transaction) => {
        await db<Search>("searches")
          .insert({
            id: uuid(),
            ip: ip,
            city: geolocation?.city || null,
            country: geolocation?.country || null,
            coordinates: geolocation?.coordinates || null,
            timezone: geolocation?.timezone || null,
            search: url,
            search_type: "url",
            url_type: urlType,
          })
          .transacting(trx);
      });
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

    return res.status(200).json({
      links: response,
      details,
    });
  } catch (err) {
    console.log({ err });
    return next(err);
  }
});

/* Method Middleware */
router.use("/", (req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    const error = new MethodNotAllowedError();
    return next(error);
  }
});

export default router;
