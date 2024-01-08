import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditusersDto } from './dto';

@Injectable()
export class usersService {
  constructor(private prisma: PrismaService) {}

  async editusers(
    usersId: number,
    dto: EditusersDto,
  ) {
    const users = await this.prisma.users.update({
      where: {
        id: usersId,
      },
      data: {
        ...dto,
      },
    });

    delete users.hash;

    return users;
  }
}
