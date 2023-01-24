import { DbInsertError } from "@core/errors";
import { Search } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<
    Search,
    | "ip"
    | "city"
    | "country"
    | "coordinates"
    | "timezone"
    | "search"
    | "search_type"
    | "url_type"
  >;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<Search> => {
  const search = await db<Search>("searches")
    .insert({
      id: uuid(),
      ip: input.ip,
      city: input.city || null,
      country: input.country || null,
      coordinates: input.coordinates || null,
      timezone: input.timezone || null,
      search: input.search,
      search_type: input.search_type,
      url_type: input.url_type || null,
    })
    .transacting(trx)
    .returning("*");

  if (!search[0]) {
    throw new DbInsertError("Search has not been inserted");
  }

  return search[0];
};
