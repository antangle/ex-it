import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthRepository } from 'src/module/auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, AuthRepository]),
  ],
  providers: [
    UserService
  ],
  exports: [UserService]
})
export class UserModule {}
