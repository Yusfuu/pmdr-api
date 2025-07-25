import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { JobsModule } from './jobs/jobs.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      subscriptions: {
        'graphql-ws': {
          path: '/gql',
          onConnect: async (ctx) => {},
          onDisconnect: async (ctx) => {
            const authHeader = ctx?.connectionParams?.authorization as string;
            const access_token = authHeader.replace('Bearer ', '');
            // clean up here
          },
        },
      },
      playground: false,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      path: '/gql',
      introspection: true,
      sortSchema: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RedisModule,
    JobsModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
