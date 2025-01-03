import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { LoginInput, RegisterInput } from 'src/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('register')
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation('signIn')
  async signIn(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(loginInput);

    context.res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user,
    };
  }

  @Mutation('refreshToken')
  async refreshToken(@Context() context) {
    const refreshToken = context.req.cookies['rt'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokenData = await this.authService.validateRefreshToken(refreshToken);

    const accessToken = this.authService.accessToken(tokenData.userId);

    return { accessToken, user: tokenData.user };
  }

  @Mutation('signOut')
  async signOut(@Context() context) {
    const refreshToken = context.req.cookies['rt'];

    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
      context.res.clearCookie('rt', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }

    return { message: 'Signed out successfully' };
  }
}
