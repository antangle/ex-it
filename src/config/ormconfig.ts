import { ConfigService } from '@nestjs/config';
import { TypeOrmConfig } from './postgresConfigService'

export default (new TypeOrmConfig(new ConfigService())).createTypeOrmOptions();