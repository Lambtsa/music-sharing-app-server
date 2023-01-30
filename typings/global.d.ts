declare namespace NodeJS {
  /**
   * Add custom environment variables
   */
  interface ProcessEnv {
    readonly PORT: string;

    readonly SPOTIFY_CLIENT_ID: string;
    readonly SPOTIFY_CLIENT_SECRET: string;
    readonly YOUTUBE_API_KEY: string;

    readonly POSTGRES_PASSWORD: string;
    readonly POSTGRES_HOST: string;
    readonly POSTGRES_USER: string;
    readonly POSTGRES_PORT: number;
    readonly POSTGRES_DB: string;
  }
}

declare type Nullable<T> = T | null;
