import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  BadRequestError,
  MethodNotAllowedError,
  UnsupportedUrlError,
} from "core/errors";
import { isValidData } from "@helpers/sanitise";
import { determineUrlType, getTrackId } from "@helpers/url";
import { GetMusicLinksInput, LinksResponseData, UserDataInput } from "@types";
import { Knex } from "knex";
import { Album, Artist, Search, Track } from "@modules";

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

    const {
      db,
      external: { spotify, deezer, youtube },
    } = req.context;

    /* ######################################## */
    /* Save Data to DB */
    /* ######################################## */
    if (user.ip) {
      /* TODO: Can ip be undefined ? */
      const { geolocation } = user as UserDataInput;
      await db.transaction(async (trx: Knex.Transaction) => {
        await Search.db.insert({
          db,
          input: {
            ip: user.ip,
            city: geolocation?.city || null,
            country: geolocation?.country || null,
            coordinates: geolocation?.coordinates || null,
            timezone: geolocation?.timezone || null,
            search: url,
            search_type: "url",
            url_type: urlType,
          },
          trx,
        });
      });
    }

    if (!urlType) {
      return next(new BadRequestError());
    }

    const trackId = getTrackId(sanitisedUrlInput, urlType);

    if (!trackId) {
      return next(new BadRequestError());
    }

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

    await db.transaction(async (trx: Knex.Transaction) => {
      const artist = await Artist.db.insert({
        db,
        input: { name: details.artist },
        trx,
      });

      const album = await Album.db.insert({
        db,
        input: { artist_id: artist.id, name: details.album },
        trx,
      });

      await Track.db.insert({
        db,
        input: { album_id: album.id, title: details.track },
        trx,
      });
    });

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
