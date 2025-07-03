import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  async saveFileInfo(filename: string, eventId: string) {
    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: { coverImageUrl: filename },
    });

    return { updatedEvent };
  }
}
