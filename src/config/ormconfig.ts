import { Logger } from '@nestjs/common/services';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfig } from '../database/typeorm.service'

export default (new TypeOrmConfig(new ConfigService()).createTypeOrmOptions());