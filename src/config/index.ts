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
      host: process.env.AWS_DB_HOST_DEV,
      port: process.env.AWS_DB_PORT_DEV || 5433,
      user: process.env.AWS_DB_USER_DEV,
      password: process.env.AWS_DB_PASSWORD_DEV,
      database: process.env.AWS_DATABASE_DEV,
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
      host: process.env.AWS_DB_HOST,
      port: process.env.AWS_DB_PORT,
      user: process.env.AWS_DB_USER,
      password: process.env.AWS_DB_PASSWORD,
      database: process.env.AWS_DATABASE,
      ssl: { rejectUnauthorized: false },
    },
  },
};
