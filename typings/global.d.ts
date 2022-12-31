declare namespace NodeJS {
  /**
   * Add custom environment variables
   */
  interface ProcessEnv {
    readonly PORT: string;
    readonly SPOTIFY_CLIENT_ID: string;
    readonly SPOTIFY_CLIENT_SECRET: string;

    readonly YOUTUBE_API_KEY: string;

    readonly AWS_DB_PASSWORD: string;
    readonly AWS_DB_HOST: string;
    readonly AWS_DB_USER: string;
    readonly AWS_DB_PORT: number;
    readonly AWS_DATABASE: string;
  }
}

declare type Nullable<T> = T | null;
