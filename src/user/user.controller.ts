import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
    ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    //apply random uuid for nickname
    createUserDto.nickname = randomUUID();
    
    //bcrypt hashing
    const rounds: number = this.configService.get<number>('BCRYPT_SALT');
    const salt: string = await bcrypt.genSalt(+rounds);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
