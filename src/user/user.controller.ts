import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { users } from '@prisma/client';
import { Getusers } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditusersDto } from './dto';
import { usersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('userss')
export class usersController {
  constructor(private usersService: usersService) {}
  @Get('me')
  getMe(@Getusers() users: users) {
    return users;
  }

  @Patch()
  editusers(
    @Getusers('id') usersId: number,
    @Body() dto: EditusersDto,
  ) {
    return this.usersService.editusers(usersId, dto);
  }
}
