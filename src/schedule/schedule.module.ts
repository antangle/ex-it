import { UserRepository } from 'src/module/user/user.repository';
import { AuthRepository } from 'src/module/auth/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthRepository, UserRepository]),
        ScheduleModule.forRoot()
    ],
    providers: [
        TasksService
    ]
})
export class MyScheduleModule {}
