import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubSub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
const USER_JOINED_ROOM = 'USER_JOINED_ROOM';
const USER_LEFT_ROOM = 'USER_LEFT_ROOM';

export { USER_JOINED_ROOM, USER_LEFT_ROOM };
