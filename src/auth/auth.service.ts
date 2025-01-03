import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput, RegisterInput } from 'src/graphql';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async accessToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: '15m', secret: 'secret' },
    );
  }

  async refreshToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: '7d', secret: 'secret' },
    );
  }

  async generateTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '15m', secret: 'secret' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '7d', secret: 'secret' },
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refreshToken.delete({ where: { token } });
  }

  async validateRefreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken) {
      throw new Error('Expired refresh token');
    }

    return refreshToken;
  }

  async signIn({ password, username }: LoginInput) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return { accessToken, refreshToken, user };
  }

  async register(registerInput: RegisterInput) {
    const hashedPassword = await this.hashPassword(registerInput.password);
    const existingUserByUsername = await this.usersService.findOneByUsername(
      registerInput.username,
    );

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create({
      ...registerInput,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return { user, accessToken, refreshToken };
  }
}
