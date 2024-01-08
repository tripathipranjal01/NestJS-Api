import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Getusers } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { bookmarksService } from './bookmarks.service';
import {
  CreatebookmarksDto,
  EditbookmarksDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarkss')
export class bookmarksController {
  constructor(
    private bookmarksService: bookmarksService,
  ) {}

  @Get()
  getbookmarkss(@Getusers('id') usersId: number) {
    return this.bookmarksService.getbookmarkss(
      usersId,
    );
  }

  @Get(':id')
  getbookmarksById(
    @Getusers('id') usersId: number,
    @Param('id', ParseIntPipe) bookmarksId: number,
  ) {
    return this.bookmarksService.getbookmarksById(
      usersId,
      bookmarksId,
    );
  }

  @Post()
  createbookmarks(
    @Getusers('id') usersId: number,
    @Body() dto: CreatebookmarksDto,
  ) {
    return this.bookmarksService.createbookmarks(
      usersId,
      dto,
    );
  }

  @Patch(':id')
  editbookmarksById(
    @Getusers('id') usersId: number,
    @Param('id', ParseIntPipe) bookmarksId: number,
    @Body() dto: EditbookmarksDto,
  ) {
    return this.bookmarksService.editbookmarksById(
      usersId,
      bookmarksId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletebookmarksById(
    @Getusers('id') usersId: number,
    @Param('id', ParseIntPipe) bookmarksId: number,
  ) {
    return this.bookmarksService.deletebookmarksById(
      usersId,
      bookmarksId,
    );
  }
}
