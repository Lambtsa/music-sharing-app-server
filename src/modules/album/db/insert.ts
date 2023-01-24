import { DbInsertError } from "@core/errors";
import { Album } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<Album, "name" | "artist_id">;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<Album> => {
  const album = await db<Album>("albums")
    .insert({
      id: uuid(),
      name: input.name,
      artist_id: input.artist_id,
    })
    .onConflict(["artist_id", "name"])
    .merge(["updated_at"])
    .transacting(trx)
    .returning("*");

  if (!album[0]) {
    throw new DbInsertError("Album has not been inserted");
  }

  return album[0];
};
