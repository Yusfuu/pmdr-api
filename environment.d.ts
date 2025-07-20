declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      JWT_SECRET: string;
      JWT_ACCESS_EXPIRATION: string;
      JWT_REFRESH_EXPIRATION: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
