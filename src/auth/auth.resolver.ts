import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Mutation('signIn')
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('deviceId') deviceId: string,
  ) {
    return this.authService.signIn(email, password, deviceId);
  }

  @Mutation('signUp')
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('deviceId') deviceId: string,
    @Args('name') name: string,
  ) {
    await this.authService.signUp(email, password, name);
    return this.authService.signIn(email, password, deviceId);
  }

  @Mutation('signOut')
  async signOut(
    @Args('refresh_token') refreshToken: string,
    @Args('deviceId') deviceId: string,
  ) {
    return this.authService.signOut(refreshToken, deviceId);
  }

  @Mutation('refreshToken')
  async refreshToken(
    @Args('refresh_token') refreshToken: string,
    @Args('deviceId') deviceId: string,
  ) {
    return this.authService.refreshTokens(refreshToken, deviceId);
  }
}
