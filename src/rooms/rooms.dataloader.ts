import * as DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ParticipantsLoader {
  constructor(private readonly prisma: PrismaService) {}

  readonly participantsLoader = new DataLoader<string, any[]>(
    async (roomIds: string[]) => {
      const roomParticipants = await this.prisma.roomParticipant.findMany({
        where: { roomId: { in: roomIds } },
        include: { user: true },
      });

      // Group participants by roomId
      const participantsMap = new Map<string, any[]>();
      roomParticipants.forEach((rp) => {
        if (!participantsMap.has(rp.roomId)) {
          participantsMap.set(rp.roomId, []);
        }
        participantsMap.get(rp.roomId).push(rp.user);
      });

      // Return participants for each roomId in the same order
      return roomIds.map((roomId) => participantsMap.get(roomId) || []);
    },
  );
}
