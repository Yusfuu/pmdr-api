import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { GlobalGuards } from './constants/global-guards';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 30, limit: 25 }]),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: { 'graphql-ws': true },
      playground: false,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      path: '/gql',
      introspection: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [...GlobalGuards, AppService, UsersResolver, UsersService],
})
export class AppModule {}
