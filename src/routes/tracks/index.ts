import express, { NextFunction, Request, Response } from "express";
import { Knex } from "knex";

import { BadRequestError, MethodNotAllowedError } from "@core/errors";
import { createRedisIdentifier, sanitiseData } from "@helpers/sanitise";
import { UserDataInput } from "@types";
import { Album, Artist, Search, Track } from "@modules";

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
    const artist = sanitiseData(rawArtist || "", { lowerCase: true });
    const track = sanitiseData(rawTrack || "", { lowerCase: true });

    const {
      db,
      external: { spotify },
      redis,
    } = req.context;

    if (artist) {
      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      if (user.ip) {
        /* TODO: Add transaction */
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
              search: artist,
              search_type: "artist",
              url_type: null,
            },
            trx,
          });
        });
      }

      const artistRedisIdentifier = createRedisIdentifier(artist);
      const cachedResponse = await redis.client.get(artistRedisIdentifier);

      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      } else {
        const response = await spotify.getListOfAlbumsByArtist(artist);
        await redis.client.set(
          artistRedisIdentifier,
          JSON.stringify(response),
          {
            EX: 60,
            NX: true,
          },
        );
        await Promise.all(
          response.albums.map(async (albumInfo) => {
            await db.transaction(async (trx: Knex.Transaction) => {
              const artist = await Artist.db.insert({
                db,
                input: { name: albumInfo.artist },
                trx,
              });

              const album = await Album.db.insert({
                db,
                input: { artist_id: artist.id, name: albumInfo.album },
                trx,
              });

              await albumInfo.tracks.map(async (track) => {
                await Track.db.insert({
                  db,
                  input: { album_id: album.id, title: track.track },
                  trx,
                });
              });
            });
          }),
        );
        return res.status(200).json(response);
      }
    }

    if (track) {
      /* ######################################## */
      /* Save Data to DB */
      /* ######################################## */
      if (user.ip) {
        /* TODO: Add transaction */
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
              search: track,
              search_type: "track",
              url_type: null,
            },
            trx,
          });
        });
      }

      const trackRedisIdentifier = createRedisIdentifier(track);
      const cachedResponse = await redis.client.get(trackRedisIdentifier);

      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      } else {
        const response = await spotify.getListOfSongsByTrack(track);

        await redis.client.set(trackRedisIdentifier, JSON.stringify(response), {
          EX: 60,
          NX: true,
        });

        await Promise.all(
          response.tracks.map(async (track) => {
            await db.transaction(async (trx: Knex.Transaction) => {
              const artist = await Artist.db.insert({
                db,
                input: { name: track.artist },
                trx,
              });

              const album = await Album.db.insert({
                db,
                input: { artist_id: artist.id, name: track.album },
                trx,
              });

              await Track.db.insert({
                db,
                input: { title: track.track, album_id: album.id },
                trx,
              });
            });
          }),
        );
        return res.status(200).json(response);
      }
    }
  } catch (err) {
    req.context.log.error({ err });
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
