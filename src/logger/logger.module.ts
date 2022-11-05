import * as winston from 'winston';
import { Module} from '@nestjs/common';
import { DataLoggingService } from './logger.service';
import { levels, passData } from './logger';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { consts } from 'src/consts/consts';
@Module({
    imports: [
        WinstonModule.forRoot({
            levels: levels,
            transports: [
              new winston.transports.Console({
                level: process.env.DEVMODE === 'dev' ? consts.DATA: 'warn',
                format: winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike('Ex-it', { prettyPrint: true }),
                ),
              }),
              new winston.transports.File({
                level: 'warn',
                filename: 'errors.log',
                dirname: 'logs/error'
              }),
              new winston.transports.File({
                level: consts.DATA,
                format: winston.format.combine(
                  passData(),
                  winston.format.timestamp(),
                  winston.format.printf(
                    ({ level, message, timestamp }): string => {
                      return `${timestamp} logLevel:${level} message:${message}`;
                    }
                  )
                ),
                filename: 'data.log',
                dirname: 'logs'
              }),
              /*new winston.transports.File({
                filename: `ex_it-warn.log`,
                dirname: 'logs',
                level: 'warn'
              }) */
            ],
          }),
    ],
    providers: [DataLoggingService],
    exports: [DataLoggingService]
})
export class LoggerModule {}
