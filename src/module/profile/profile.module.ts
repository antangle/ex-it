import { UserRepository } from './../user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UtilModule } from 'src/module/util/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    AuthModule,
    UtilModule,
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
