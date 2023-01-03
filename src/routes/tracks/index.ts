import express, { NextFunction, Request, Response } from "express";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

import { BadRequestError, MethodNotAllowedError } from "@core/errors";
import { sanitiseData } from "@helpers/sanitise";
import { UserDataInput } from "@types";
import { Search } from "types/tables.types";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* DATA */
    /* ######################################## */
    const {
      body: { artist: rawArtist, track: rawTrack, user },
    } = req;
    if (!rawArtist && !rawTrack) {
      next(new BadRequestError());
    }

    /* We sanitise before checking to make sure that we have an accurate input */
    const artist = sanitiseData(rawArtist || "");
    const track = sanitiseData(rawTrack || "");

    const {
      db,
      external: { spotify },
    } = req.context;

    if (artist) {
      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      if (user.ip) {
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
              search: artist,
              search_type: "artist",
              url_type: null,
            })
            .transacting(trx);
        });
      }

      const response = await spotify.getListOfAlbumsByArtist(
        sanitiseData(rawArtist),
      );
      return res.status(200).json(response);
    }

    if (track) {
      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      if (user.ip) {
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
              search: track,
              search_type: "track",
              url_type: null,
            })
            .transacting(trx);
        });
      }

      const response = await spotify.getListOfSongsByTrack(
        sanitiseData(rawTrack),
      );
      return res.status(200).json(response);
    }
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
