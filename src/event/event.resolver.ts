import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventService } from './event.service';
import { CreateEventInput } from 'src/graphql';

@Resolver('Event')
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation('createEvent')
  create(@Args('data') createEventInput: CreateEventInput) {
    return this.eventService.create(createEventInput);
  }

  @Query('event')
  findOne(@Args('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Query('events')
  findAll() {
    return this.eventService.findAll();
  }

  @Mutation('removeEvent')
  remove(@Args('id') id: string) {
    return this.eventService.remove(id);
  }
}
