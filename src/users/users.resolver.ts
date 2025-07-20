import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput, User } from 'src/graphql/graphql';
import { pubSub } from 'src/common/constants/pubsub';
import * as bcrypt from 'bcrypt';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query('users')
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput) {
    const password = await bcrypt.hash(input.password, 10);

    const user = await this.userService.create({ ...input, password });
    await pubSub.publish('userCreated', { userCreated: user });
    return user;
  }

  @Subscription()
  userCreated() {
    return pubSub.asyncIterableIterator('userCreated');
  }
}
