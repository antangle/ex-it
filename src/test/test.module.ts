import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestTable } from 'src/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestTable])],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
