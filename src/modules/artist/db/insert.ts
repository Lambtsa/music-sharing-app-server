import { DbInsertError } from "@core/errors";
import { Artist } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<Artist, "name">;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<Artist> => {
  const artist = await db<Artist>("artists")
    .insert({
      id: uuid(),
      name: input.name,
    })
    .transacting(trx)
    .onConflict("name")
    .merge(["updated_at"])
    .returning("*");

  if (!artist[0]) {
    throw new DbInsertError("Artist has not been inserted");
  }

  return artist[0];
};
