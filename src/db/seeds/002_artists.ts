import { Artist } from "@types";
import type { Knex } from "knex";
import { v4 as uuid } from "uuid";

const artists = [
  "Hans Zimmer",
  "Beth Hart",
  "Arcade Fire",
  "Radiohead",
  "Last Train",
  "Xavier Rudd",
  "Nirvana",
  "2Pac",
  "John Mayer",
  "Pink Floyd",
  "Dire Straits",
  "Nas",
  "Pink",
  "Foo Fighters",
  "Foals",
  "Noir désir",
  "Queens of the stone age",
  "Bicep",
  "Damien rice",
  "Ben harper",
  "John butler trio",
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("artists").del();

  // Inserts seed entries
  await Promise.all(
    artists.map(async (artist) => {
      return await knex<Artist>("artists").insert({
        id: uuid(),
        name: artist,
      });
    }),
  );
}
