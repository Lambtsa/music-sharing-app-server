import { BadRequestError, MethodNotAllowedError } from "@core/errors";
import { sanitiseData } from "@helpers/sanitise";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* DATA */
    /* ######################################## */
    const {
      body: { artist: rawArtist, track: rawTrack },
    } = req;
    if (!rawArtist && !rawTrack) {
      next(new BadRequestError());
    }

    /* We sanitise before checking to make sure that we have an accurate input */
    const artist = sanitiseData(rawArtist || "");
    const track = sanitiseData(rawTrack || "");

    const { spotify } = req.context.external;

    if (artist) {
      const response = await spotify.getListOfAlbumsByArtist(
        sanitiseData(rawArtist),
      );

      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      // if (!!user.ip && !!user.geolocation) {
      //   /* TODO: Add transaction */
      //   const { ip, geolocation } = user as UseUserDataReturnType;
      //   await knex.transaction(async (trx) => {
      //     await knex<Search>("searches").transacting(trx).insert({
      //       id: uuid(),
      //       ip: ip,
      //       city: geolocation?.city || null,
      //       country: geolocation?.country || null,
      //       coordinates: geolocation?.coordinates || null,
      //       timezone: geolocation?.timezone || null,
      //       search: artist,
      //       search_type: "artist",
      //       url_type: null,
      //     });
      //   });
      // }
      return res.status(200).json(response);
    }

    if (track) {
      const response = await spotify.getListOfSongsByTrack(
        sanitiseData(rawTrack),
      );

      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      // if (!!user.ip && !!user.geolocation) {
      //   /* TODO: Add transaction */
      //   const { ip, geolocation } = user as UseUserDataReturnType;
      //   await knex.transaction(async (trx) => {
      //     await knex<Search>("searches").transacting(trx).insert({
      //       id: uuid(),
      //       ip: ip,
      //       city: geolocation?.city || null,
      //       country: geolocation?.country || null,
      //       coordinates: geolocation?.coordinates || null,
      //       timezone: geolocation?.timezone || null,
      //       search: track,
      //       search_type: "track",
      //       url_type: null,
      //     });
      //   });
      // }
      return res.status(200).json(response);
    }
  } catch (err) {
    console.log({ err });
    return next(err);
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
