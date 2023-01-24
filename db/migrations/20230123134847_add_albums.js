/** @type {import('knex').Knex.Migration['up']} */
const TABLE = "albums";

exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
    CREATE TABLE "public"."${TABLE}" (
      "id" UUID NOT NULL PRIMARY KEY,
      "artist_id" UUID NOT NULL,
      CONSTRAINT "fk_album_artist" FOREIGN KEY("artist_id") REFERENCES artists(id) ON DELETE CASCADE,
      "name" varchar(255) NOT NULL,
      UNIQUE ("artist_id", "name"),
      "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/** @type {import('knex').Knex.Migration['down']} */
exports.down = async function (knex) {
  // Drop table
  await knex.schema.dropTable(TABLE);
};
