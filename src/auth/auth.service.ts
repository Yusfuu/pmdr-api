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

  async signUp(email: string, password: string, name: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await this.hashPassword(password);
    return this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });
  }

  async signIn(email: string, password: string, deviceId: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const match = await this.verifyPasswordHash(password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const access_token = await this.createAccessToken({ id: user.id });
    const refresh_token = await this.createRefreshToken({
      id: user.id,
      deviceId,
    });

    await this.redisClient.set(
      `refresh_token:${user.id}:${deviceId}`,
      refresh_token,
      'EX',
      +process.env.JWT_REFRESH_EXPIRATION,
    );

    return { access_token, refresh_token };
  }

  async signOut(refreshToken: string, deviceId: string) {
    const payload = await this.verifyToken<{ id: string }>(refreshToken);

    const storedToken = await this.redisClient.get(
      `refresh_token:${payload.id}:${deviceId}`,
    );
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.redisClient.del(`refresh_token:${payload.id}:${deviceId}`);
    return true;
  }

  async refreshTokens(refreshToken: string, deviceId: string) {
    const payload = await this.verifyToken<{ id: string; deviceId: string }>(
      refreshToken,
    );

    const storedToken = await this.redisClient.get(
      `refresh_token:${payload.id}:${deviceId}`,
    );

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.deviceId !== deviceId) {
      throw new UnauthorizedException('Token does not match device');
    }

    const user = await this.usersService.findById(payload.id);
    if (!user) throw new UnauthorizedException();

    const access_token = await this.createAccessToken({ id: user.id });
    const refresh_token = await this.createRefreshToken({
      id: user.id,
      deviceId,
    });

    await this.redisClient.set(
      `refresh_token:${user.id}:${deviceId}`,
      refresh_token,
      'EX',
      parseInt(process.env.JWT_REFRESH_EXPIRATION, 10),
    );

    return { access_token, refresh_token };
  }

  async createAccessToken(payload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_EXPIRATION}s`,
    });
  }

  async createRefreshToken(payload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_EXPIRATION}s`,
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async verifyPasswordHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
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
