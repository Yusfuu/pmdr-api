import { Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateEventInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventInput: CreateEventInput) {
    return null;

    // const event = await this.prisma.event.create({
    //   data: {
    //     ...createEventInput,
    //     hostId: '0c2d6557-6434-4ed2-a1e9-ceed654ee676',
    //     scheduledAt: dayjs(createEventInput.scheduledAt).toDate(),
    //     coverImageUrl: "azaz",
    //     title: "azaz",
    //   },
    //   include: { host: true },
    // });

    // return event;
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { host: true },
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: { host: true },
    });

    return events.map((event) => ({
      ...event,
      scheduledAt: event.scheduledAt.toString(),
    }));
  }

  async remove(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Event with ID ${id} not found`);

    return this.prisma.event.delete({ where: { id } });
  }
}
