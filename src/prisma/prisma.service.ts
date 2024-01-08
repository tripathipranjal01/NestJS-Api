import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, PrismaPromise, UnwrapTuple } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  bookmarks: any;
  users: any;

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async $transaction<P extends PrismaPromise<any>[]>(
    operations: [...P]
  ): Promise<UnwrapTuple<P>> {
    return super.$transaction(operations) as Promise<UnwrapTuple<P>>;
  }

  cleanDb() {
    return this.$transaction([
      this.bookmarks.deleteMany(),
      this.users.deleteMany(),
    ]);
  }
}
