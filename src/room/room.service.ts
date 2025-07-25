import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(name: string, ownerId: string) {
    return this.prisma.room.create({
      data: {
        name,
        ownerId,
        members: { create: { userId: ownerId } },
      },
      include: { owner: true, members: { include: { user: true } } },
    });
  }

  async joinRoom(roomId: string, userId: string) {
    const existing = await this.prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId } },
      include: { user: true },
    });

    if (existing) return existing;

    return this.prisma.roomMember.create({
      data: { userId, roomId },
      include: { user: true },
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    return this.prisma.roomMember.deleteMany({
      where: { userId, roomId },
    });
  }

  async findById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        owner: true,
        members: { include: { user: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: {
        owner: true,
        members: { include: { user: true } },
      },
    });
  }
}
