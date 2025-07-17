import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from '../guards/gql-throttler.guard';

export const GlobalGuards = [
  {
    provide: APP_GUARD,
    useClass: GqlThrottlerGuard,
  },
];
