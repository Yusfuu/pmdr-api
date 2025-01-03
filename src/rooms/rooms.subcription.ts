import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { pubsub } from './pubsub';

@Resolver('Room')
export class RoomSubscriptionsResolver {
  @Subscription('roomUpdated', {
    filter(this: RoomSubscriptionsResolver, payload, variables) {
      return payload.roomUpdated.room.id === variables.roomId;
    },
  })
  async roomUpdated(@Args('roomId') roomId: string) {
    return pubsub.asyncIterableIterator(`room-${roomId}`);
  }

  @Subscription('signalReceived', {
    resolve: (payload) => payload.signalReceived,
    filter: (payload, variables) => payload.roomId === variables.roomId,
  })
  signalReceived(@Args('roomId') roomId: string) {
    return pubsub.asyncIterableIterator(`signal-${roomId}`);
  }
}
