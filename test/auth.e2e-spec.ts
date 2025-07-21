import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import Redis from 'ioredis';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let redis: Redis;

  const testUser = {
    email: 'Hellen.Bauch@gmail.com',
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

    // Optionally create user here if registration not tested
  });

  afterAll(async () => {
    await redis.quit();
    await app.get(PrismaService).onModuleDestroy(); // optional

    await app.close();
  });

  let access_token: string;
  let refresh_token: string;

  it('should login and return tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
        mutation {
          signIn(email: "${testUser.email}", password: "${testUser.password}") {
            access_token
            refresh_token
          }
        }`,
      });

    expect(res.body.data.signIn.access_token).toBeDefined();
    expect(res.body.data.signIn.refresh_token).toBeDefined();

    access_token = res.body.data.signIn.access_token;
    refresh_token = res.body.data.signIn.refresh_token;
  });

  it('should access protected "me" route with access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/gql')
      .set('Authorization', `Bearer ${access_token}`)
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

    expect(res.body.data.me.email).toEqual(testUser.email);
  });

  it('should refresh tokens using refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
        mutation {
          refreshToken(refresh_token: "${refresh_token}") {
            access_token
            refresh_token
          }
        }`,
      });

    expect(res.body.data.refreshToken.access_token).toBeDefined();
    expect(res.body.data.refreshToken.refresh_token).toBeDefined();
  });

  it('should reject invalid access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/gql')
      .set('Authorization', `Bearer invalidtoken`)
      .send({
        query: `query { me { id email name } }`,
      });

    expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
  });

  it('should reject expired/invalid refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/gql')
      .send({
        query: `
          mutation {
            refreshToken(refresh_token: "invalid.refresh.token") {
              access_token
              refresh_token
            }
          }`,
      });

    expect(res.body.errors[0].message).toContain('Invalid or expired');
  });
});
