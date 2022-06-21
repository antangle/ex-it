import { TestTable } from './../entities/test.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestTable)
    private testRepository: Repository<TestTable>,
  ){}

  create(createTestDto: CreateTestDto) {
    return this.testRepository.save(createTestDto);
  }

  findAll() {
    return this.testRepository.find();
  }

  findOne(id: number) {
    return this.testRepository.findOne(id);
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return this.testRepository.update(id, updateTestDto);
  }

  remove(id: number) {
    const softDeleteDto: UpdateTestDto = {
      name: "",
      age: 0
    }

    return this.testRepository.update(id, softDeleteDto);
  }
}
