import { HttpMethods } from "@types";

interface ConfigType {
  cors: {
    origin: string[];
    methods: Extract<HttpMethods, "POST">[];
  };
  rateLimiter: {
    interval: number;
    max: number;
  };
}
interface Config {
  dev: ConfigType;
  prod: ConfigType;
}

export const config: Config = {
  dev: {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000 * 60,
      max: 300,
    },
  },
  prod: {
    cors: {
      origin: ["https://audiolinx.xyz", "https://www.audiolinx.xyz"],
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000,
      max: 5,
    },
  },
};
