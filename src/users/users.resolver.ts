import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput, User } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query('users')
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
}
