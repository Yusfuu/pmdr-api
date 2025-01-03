import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParticipantsLoader } from './rooms.dataloader';
import { RoomSubscriptionsResolver } from './rooms.subcription';

@Module({
  providers: [
    RoomsResolver,
    RoomsService,
    ParticipantsLoader,
    RoomSubscriptionsResolver,
  ],
  imports: [PrismaModule],
  controllers: [],
})
export class RoomsModule {}
