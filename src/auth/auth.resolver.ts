import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/guards/gql-auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/graphql/graphql';

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
  ) {
    return this.authService.signIn(email, password);
  }

  @Mutation('refreshToken')
  async refreshToken(@Args('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Query('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }
}
