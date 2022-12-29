import { TimeSetter } from './../../entities/timeSetter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainController } from './main.controller';
import { Module } from '@nestjs/common';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        TimeSetter
      ]),
    ],
    controllers: [MainController],
  })
export class MainModule {}