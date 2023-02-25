import { RedisClientType } from "redis";
import * as redis from "redis";
import { Logger, LoggerOptions, DestinationStream } from "pino";
import { RedisConnectionError } from "./errors";

/**
 *
 */
export class RedisContext {
  #log;
  /* TODO: Sort out redis on prod */
  client: RedisClientType = redis.createClient();

  constructor(log: Logger<LoggerOptions | DestinationStream>) {
    this.#log = log;
  }

  /**
   *
   */
  async connect() {
    this.client.on("error", (error) => {
      this.#log.error(`Error : ${error}`);
      throw new RedisConnectionError("Redis connection error");
    });
    this.client.on("connect", () => this.#log.info("Redis connected"));
    this.client.on("reconnecting", () => this.#log.info("Redis reconnecting"));
    this.client.on("ready", () => this.#log.info("Redis ready!"));

    await this.client.connect();
  }
}
