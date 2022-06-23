import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService
  ){}

  //insert user
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  //find user by email
  findOneByEmail(email: string):Promise<User>{
    return this.userRepository.findOne({
      email: email
    });
  }

  async hashUserDto(password: string): Promise<string>{
    const rounds: number = this.configService.get<number>('BCRYPT_SALT');
    const salt: string = await bcrypt.genSalt(+rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number):Promise<User> {
    return this.userRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto):Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number):Promise<UpdateResult> {
    return this.userRepository.softDelete(id);
  }
}

