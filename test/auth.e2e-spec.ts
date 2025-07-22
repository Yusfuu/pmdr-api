import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import Redis from 'ioredis';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let redis: Redis;
  let accessToken: string;
  let refreshToken: string;

  const testUser = {
    email: 'Maida44@yahoo.com',
    password: 'secret',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  });

  afterAll(async () => {
    await redis.quit();
    await app.get(PrismaService).onModuleDestroy?.();
    await app.close();
  });

  it('should sign in and return tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
          mutation {
            signIn(email: "${testUser.email}", password: "${testUser.password}") {
              access_token
              refresh_token
            }
          }
        `,
      });

    const tokens = response.body.data?.signIn;

    expect(tokens).toBeDefined();
    expect(tokens.access_token).toBeDefined();
    expect(tokens.refresh_token).toBeDefined();

    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
  });

  it('should access "me" query with valid access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/gql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query {
            me {
              id
              email
              name
            }
          }
        `,
      });

    const me = response.body.data?.me;

    expect(me).toBeDefined();
    expect(me.email).toBe(testUser.email);
  });

  it('should refresh tokens using refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
          mutation {
            refreshToken(refresh_token: "${refreshToken}") {
              access_token
              refresh_token
            }
          }
        `,
      });

    const tokens = response.body.data?.refreshToken;

    expect(tokens).toBeDefined();
    expect(tokens.access_token).toBeDefined();
    expect(tokens.refresh_token).toBeDefined();
  });

  it('should reject request with invalid access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/gql')
      .set('Authorization', `Bearer invalid.token`)
      .send({
        query: `
          query {
            me {
              id
              email
              name
            }
          }
        `,
      });

    const error = response.body.errors?.[0];
    expect(error).toBeDefined();
    expect(error.extensions.code).toBe('UNAUTHENTICATED');
  });

  it('should reject invalid refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
          mutation {
            refreshToken(refresh_token: "invalid.refresh.token") {
              access_token
              refresh_token
            }
          }
        `,
      });

    const error = response.body.errors?.[0];
    expect(error).toBeDefined();
    expect(error.message).toMatch(/Invalid or expired/i);
  });

  it('should logout and invalidate refresh token', async () => {
    const logoutRes = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
        mutation {
          signOut(refresh_token: "${refreshToken}")
        }
      `,
      });

    expect(logoutRes.body.data.signOut).toBe(true);

    const refreshRes = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
        mutation {
          refreshToken(refresh_token: "${refreshToken}") {
            access_token
            refresh_token
          }
        }
      `,
      });

    expect(refreshRes.body.errors?.[0].message).toMatch(/Invalid or expired/i);
  });
});
