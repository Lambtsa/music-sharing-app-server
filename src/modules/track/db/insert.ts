import { DbInsertError } from "@core/errors";
import { Track } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<Track, "album_id" | "title">;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<Track> => {
  const track = await db<Track>("tracks")
    .insert({
      id: uuid(),
      title: input.title,
      album_id: input.album_id,
    })
    .transacting(trx)
    .onConflict(["album_id", "title"])
    .merge(["updated_at"])
    .returning("*");

  if (!track[0]) {
    throw new DbInsertError("Track has not been inserted");
  }

  return track[0];
};
