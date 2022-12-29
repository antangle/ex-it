import { consts } from './../../consts/consts';
import { TimeSetter } from './../../entities/timeSetter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository, QueryRunner } from 'typeorm';
import { NotOperationTimeException } from 'src/exception/noOperationTime.exception';

@Injectable()
export class MainService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        @InjectRepository(TimeSetter) private timeSetterRepository: Repository<TimeSetter>
    ) {}
    
    async getOperationTime(){
        return await this.timeSetterRepository.findOne();
    }

    async isOperationTime(queryRunner?: QueryRunner){
        const repository = queryRunner ? queryRunner.manager.getRepository(TimeSetter) : this.timeSetterRepository;
        
        const {start, end} = await repository.findOne();
        const now = new Date().getHours()

        if(start <= now && now < end){
            return true
        } else{
            throw new NotOperationTimeException(this.isOperationTime.name, consts.NOT_OPERATION_TIME_ERROR_CODE)
        }
    }
}