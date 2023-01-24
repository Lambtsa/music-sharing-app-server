import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("albums").del();

  const data = new Array(20).fill(null);

  // Inserts seed entries
  await Promise.all(
    data.map(async () => {
      // return await knex("albums").insert();
    }),
  );
}
