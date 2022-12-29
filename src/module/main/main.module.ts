import { TimeSetter } from './../../entities/timeSetter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainController } from './main.controller';
import { Module } from '@nestjs/common';
import { MainService } from './main.service';
@Module({
    imports: [
      TypeOrmModule.forFeature([
        TimeSetter
      ]),
    ],
    controllers: [MainController],
    providers: [MainService],
    exports: [MainService]
  })
export class MainModule {}