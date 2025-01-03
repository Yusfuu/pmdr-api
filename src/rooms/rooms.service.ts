import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { CreateRoomInput, JoinRoomInput, LeaveRoomInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getParticipantsByRoomId(roomId: string) {
    const participants = await this.prisma.roomParticipant.findMany({
      where: { roomId },
      include: { user: true },
    });

    return participants.map((participant) => participant.user);
  }

  create(createRoomInput: CreateRoomInput) {
    const { hostId, name } = createRoomInput;

    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

    const sessions_id = `${nanoid(3)}-${nanoid(3)}-${nanoid(3)}`.toLowerCase();

    return this.prisma.room.create({
      data: { hostId, name, id: sessions_id },
    });
  }

  async isParticipating(userId: string, roomId: string) {
    return this.prisma.roomParticipant.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });
  }

  findAll() {
    return this.prisma.room.findMany({
      include: { participants: true, host: true },
    });
  }

  findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { participants: true, host: true },
    });
  }

  async findHostedRoomsByUserId(userId: string) {
    const roomsAsHost = await this.prisma.room.findMany({
      where: { hostId: userId },
      include: {
        host: true,
      },
    });

    return roomsAsHost;
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }

  async joinRoom(joinRoomInput: JoinRoomInput) {
    const { roomId, userId } = joinRoomInput;

    const room = await this.findOne(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
    }

    const isParticipating = await this.isParticipating(userId, roomId);

    if (isParticipating) {
      throw new ForbiddenException(
        `User is already a participant in the room.`,
      );
    }

    // Add the user to the room
    await this.prisma.roomParticipant.create({
      data: { userId, roomId },
    });

    return this.findOne(roomId);
  }

  async leaveRoom(leaveRoomInput: LeaveRoomInput) {
    const { roomId, userId } = leaveRoomInput;

    const room = await this.findOne(roomId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isParticipating = await this.isParticipating(userId, roomId);

    if (!isParticipating) {
      throw new ForbiddenException('User is not a participant in the room');
    }

    await this.prisma.roomParticipant.delete({
      where: { id: isParticipating.id },
    });

    return this.findOne(roomId);
  }
}
