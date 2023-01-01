import Knex from "knex";

const isProd = process.env.NODE_ENV === "production";

export const createConnection = () => {
  return Knex({
    client: "pg",
    connection: {
      host: isProd ? process.env.AWS_DB_HOST : "localhost",
      port: isProd ? process.env.AWS_DB_PORT : 5432,
      user: isProd ? process.env.AWS_DB_USER : "postgres",
      password: isProd ? process.env.AWS_DB_PASSWORD : "postgres",
      database: isProd ? process.env.AWS_DATABASE : "audiolinx",
      ssl: { rejectUnauthorized: false },
    },
    searchPath: ["public", "public"],
    acquireConnectionTimeout: 15000,
    pool: {
      min: 0,
      max: 1000,
      acquireTimeoutMillis: 3000,
      idleTimeoutMillis: 5000,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  });
};
