declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      JWT_SECRET: string;
      JWT_ACCESS_EXPIRATION: number;
      JWT_REFRESH_EXPIRATION: number;
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
