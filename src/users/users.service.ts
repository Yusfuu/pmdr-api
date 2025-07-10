import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  create(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }
}
