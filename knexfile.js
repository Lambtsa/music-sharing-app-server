require("dotenv").config({ path: ".env.local" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
/* TODO: make this more secure */
module.exports = {
  client: "pg",
  connection: {
    host: "217.160.153.197",
    // host: process.env.AWS_DB_HOST || "localhost",
    port: 5432,
    // port: process.env.AWS_DB_PORT || 5432,
    user: "audiolinx",
    // user: process.env.AWS_DB_USER || "postgres",
    password: "7vQ25%$ZjOeQ",
    // password: process.env.AWS_DB_PASSWORD || "password",
    database: "audiolinx",
    // database: process.env.DATABASE || "",
  },
  searchPath: [process.env.SCHEMA || "postgres", "public"],
  pool: {
    acquireTimeoutMillis: 300 * 1000,
    createTimeoutMillis: 300 * 1000,
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
    schemaName: "public",
    stub: "db/knex.migration.stub.js",
  },
  seeds: {
    extension: "js",
    directory: "./dist/db/seeds",
    stub: "src/db/knex.seed.stub.ts",
  },
};
