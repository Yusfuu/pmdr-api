import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.verifyPasswordHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.access_token({ id: user.id });

    const refresh_token = await this.refresh_token({ id: user.id });

    await this.redisClient.set(
      `refresh_token:${user.id}`,
      refresh_token,
      'EX',
      parseInt(process.env.JWT_REFRESH_EXPIRATION, 10),
    );

    return { access_token, refresh_token };
  }

  async signOut(refreshToken: string) {
    const payload = await this.verifyToken<{ id: string }>(refreshToken);

    const storedToken = await this.redisClient.get(
      `refresh_token:${payload.id}`,
    );
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.redisClient.del(`refresh_token:${payload.id}`);
    return true;
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.verifyToken<{ id: string }>(refreshToken);

    const storedToken = await this.redisClient.get(
      `refresh_token:${payload.id}`,
    );

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.id);
    if (!user) throw new UnauthorizedException();

    const access_token = await this.access_token({ id: user.id });
    const refresh_token = await this.refresh_token({ id: user.id });

    await this.redisClient.set(
      `refresh_token:${user.id}`,
      refresh_token,
      'EX',
      parseInt(process.env.JWT_REFRESH_EXPIRATION, 10),
    );

    return { access_token, refresh_token };
  }

  async access_token(payload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_EXPIRATION}s`,
    });
  }

  async refresh_token(payload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_EXPIRATION}s`,
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async verifyPasswordHash(hash: string, password: string) {
    return bcrypt.compare(hash, password);
  }

  private async verifyToken<T extends object = any>(token: string): Promise<T> {
    try {
      return await this.jwtService.verifyAsync<T>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
