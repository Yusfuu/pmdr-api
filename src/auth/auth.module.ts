import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [AuthService, UsersService, JwtService, AuthResolver],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'your-secret-key',
      secretOrPrivateKey: 'your-secret-key',
    }),
  ],
})
export class AuthModule {}
