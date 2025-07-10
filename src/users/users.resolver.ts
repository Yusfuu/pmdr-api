import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query('users')
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
