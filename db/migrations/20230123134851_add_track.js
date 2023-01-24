/** @type {import('knex').Knex.Migration['up']} */
const TABLE = "tracks";

exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
    CREATE TABLE "public"."${TABLE}" (
      "id" UUID NOT NULL PRIMARY KEY,
      "title" varchar(255) NOT NULL,
      "album_id" UUID NOT NULL,
      CONSTRAINT "fk_album_tracks" FOREIGN KEY("album_id") REFERENCES albums(id) ON DELETE CASCADE,
      UNIQUE ("album_id", "title"),
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
