import Knex from "knex";

export const createConnection = () => {
  return Knex({
    client: "pg",
    connection: {
      host: process.env.AWS_DB_HOST,
      port: 5432,
      user: process.env.AWS_DB_USER,
      password: process.env.AWS_DB_PASSWORD,
      database: "",
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
