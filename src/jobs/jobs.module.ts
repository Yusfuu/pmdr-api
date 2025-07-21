import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [JobsService],
  imports: [BullModule.registerQueue({ name: 'email' })],
})
export class JobsModule {}
