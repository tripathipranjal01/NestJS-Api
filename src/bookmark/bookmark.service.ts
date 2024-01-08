import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatebookmarksDto,
  EditbookmarksDto,
} from './dto';

@Injectable()
export class bookmarksService {
  constructor(private prisma: PrismaService) {}

  getbookmarkss(usersId: number) {
    return this.prisma.bookmarks.findMany({
      where: {
        usersId,
      },
    });
  }

  getbookmarksById(
    usersId: number,
    bookmarksId: number,
  ) {
    return this.prisma.bookmarks.findFirst({
      where: {
        id: bookmarksId,
        usersId,
      },
    });
  }

  async createbookmarks(
    usersId: number,
    dto: CreatebookmarksDto,
  ) {
    const bookmarks =
      await this.prisma.bookmarks.create({
        data: {
          usersId,
          ...dto,
        },
      });

    return bookmarks;
  }

  async editbookmarksById(
    usersId: number,
    bookmarksId: number,
    dto: EditbookmarksDto,
  ) {
    // get the bookmarks by id
    const bookmarks =
      await this.prisma.bookmarks.findUnique({
        where: {
          id: bookmarksId,
        },
      });

    // check if users owns the bookmarks
    if (!bookmarks || bookmarks.usersId !== usersId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.bookmarks.update({
      where: {
        id: bookmarksId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletebookmarksById(
    usersId: number,
    bookmarksId: number,
  ) {
    const bookmarks =
      await this.prisma.bookmarks.findUnique({
        where: {
          id: bookmarksId,
        },
      });

    // check if users owns the bookmarks
    if (!bookmarks || bookmarks.usersId !== usersId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.bookmarks.delete({
      where: {
        id: bookmarksId,
      },
    });
  }
}
