import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { EventModule } from './event/event.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      subscriptions: { 'graphql-ws': true },
      context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
    }),
    UsersModule,
    EventModule,
    StorageModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
