import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import {
  CreateRoomInput,
  JoinRoomInput,
  LeaveRoomInput,
  Room,
} from 'src/graphql';
import { ParticipantsLoader } from './rooms.dataloader';
import { pubsub } from './pubsub';

@Resolver('Room')
export class RoomsResolver {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly participantsLoader: ParticipantsLoader,
  ) {}

  @Mutation('createRoom')
  create(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return this.roomsService.create(createRoomInput);
  }

  @Query('rooms')
  findAll() {
    return this.roomsService.findAll();
  }
  @Query('hostedRoomsByUserId')
  gethostedRoomsByUserId(@Args('userId') userId: string) {
    return this.roomsService.findHostedRoomsByUserId(userId);
  }

  @Query('room')
  findOne(@Args('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Mutation('removeRoom')
  remove(@Args('id') id: string) {
    return this.roomsService.remove(id);
  }

  @Mutation('joinRoom')
  async joinRoom(@Args('joinRoomInput') joinRoomInput: JoinRoomInput) {
    const room = await this.roomsService.joinRoom(joinRoomInput);

    pubsub.publish(`room-${room.id}`, { roomUpdated: { room } });

    return room;
  }

  @Mutation('leaveRoom')
  async leaveRoom(@Args('leaveRoomInput') leaveRoomInput: LeaveRoomInput) {
    const room = await this.roomsService.leaveRoom(leaveRoomInput);

    pubsub.publish(`room-${room.id}`, { roomUpdated: { room } });

    return room;
  }

  @ResolveField('participants')
  async resolveParticipants(@Parent() room: Room) {
    return this.roomsService.getParticipantsByRoomId(room.id);
  }

  @Mutation('sendSignal')
  async sendSignal(
    @Args('roomId') roomId: string,
    @Args('signal') signal: any,
  ): Promise<boolean> {
    await pubsub.publish(`signal-${roomId}`, { signalReceived: signal });
    return true;
  }
}
