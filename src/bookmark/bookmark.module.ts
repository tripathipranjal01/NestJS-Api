import { Module } from '@nestjs/common';
import { bookmarksController } from './bookmarks.controller';
import { bookmarksService } from './bookmarks.service';

@Module({
  controllers: [bookmarksController],
  providers: [bookmarksService]
})
export class bookmarksModule {}
