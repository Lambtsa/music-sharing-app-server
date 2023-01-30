import { HttpMethods } from "@types";
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface ConfigType {
  cors: {
    origin: string;
    methods: Extract<HttpMethods, "POST">[];
  };
  rateLimiter: {
    interval: number;
    max: number;
  };
  connection: Knex.Config["connection"];
}
interface Config {
  dev: ConfigType;
  prod: ConfigType;
}

export const config: Config = {
  dev: {
    cors: {
      origin: "https://localhost:3000",
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000 * 60,
      max: 300,
    },
    connection: {
      host: "db",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "audiolinx",
      // ssl: { rejectUnauthorized: false },
    },
  },
  prod: {
    cors: {
      origin: "https://audiolinx.xyz",
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000,
      max: 100,
    },
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: { rejectUnauthorized: false },
    },
  },
};
