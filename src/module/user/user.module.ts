import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthRepository } from 'src/module/auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, AuthRepository]),
  ],
  controllers: [UserController],
  providers: [
    UserService
  ],
  exports: [UserService]
})
export class UserModule {}
