import {
  Resolver,
  Mutation,
  Args,
  Subscription,
  Context,
  Query,
} from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  pubSub,
  USER_JOINED_ROOM,
  USER_LEFT_ROOM,
} from 'src/common/constants/pubsub';

@Resolver('Room')
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Query('room')
  async room(@Args('id') id: string) {
    return this.roomService.findById(id);
  }

  // @UseGuards(AuthGuard)
  @Query('rooms')
  async rooms() {
    return this.roomService.findAll();
  }

  @UseGuards(AuthGuard)
  @Mutation('createRoom')
  async createRoom(@Args('name') name: string, @Context() ctx): Promise<Room> {
    const userId = ctx.req.user.id;
    const room = await this.roomService.createRoom(name, userId);
    await pubSub.publish('roomCreated', { roomCreated: room });
    return room;
  }

  @UseGuards(AuthGuard)
  @Mutation('joinRoom')
  async joinRoom(@Args('roomId') roomId: string, @Context() ctx) {
    const userId = ctx.req.user.id;
    const membership = await this.roomService.joinRoom(roomId, userId);
    await pubSub.publish(USER_JOINED_ROOM, { userJoinedRoom: membership });
    return membership;
  }

  @UseGuards(AuthGuard)
  @Mutation('leaveRoom')
  async leaveRoom(@Args('roomId') roomId: string, @Context() ctx) {
    const userId = ctx.req.user.id;
    await this.roomService.leaveRoom(roomId, userId);
    await pubSub.publish(USER_LEFT_ROOM, { userLeftRoom: { roomId, userId } });
    return true;
  }

  @Subscription('roomCreated', {
    resolve: (payload) => payload.roomCreated,
  })
  roomCreated() {
    return pubSub.asyncIterableIterator('roomCreated');
  }

  @Subscription('userJoinedRoom', {
    filter: (payload, variables) => {
      return payload.userJoinedRoom.roomId === variables.roomId;
    },
    resolve: (payload) => payload.userJoinedRoom,
  })
  userJoinedRoom() {
    return pubSub.asyncIterableIterator(USER_JOINED_ROOM);
  }

  @Subscription('userLeftRoom', {
    filter: (payload, variables) => {
      return payload.userLeftRoom.roomId === variables.roomId;
    },
    resolve: (payload) => payload.userLeftRoom,
  })
  userLeftRoom() {
    return pubSub.asyncIterableIterator(USER_LEFT_ROOM);
  }
}
