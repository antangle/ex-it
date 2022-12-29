import * as winston from 'winston';
import { Module} from '@nestjs/common';
import { DataLoggingService } from './logger.service';
import { levels, passData } from './logger';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { consts } from 'src/consts/consts';
import WinstonDailyRotate from 'winston-daily-rotate-file';
@Module({
    imports: [
        WinstonModule.forRoot({
            levels: levels,
            transports: [
              new winston.transports.Console({
                level: process.env.DEVMODE === 'dev' ? consts.DATA: 'log',
                format: winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike('Ex-it', { prettyPrint: process.env.DEVMODE === 'dev' ? true : false }),
                ),
              }),
              new WinstonDailyRotate({
                level: 'warn',
                format: winston.format.printf(
                  ({ level, message, timestamp }): string => {
                    return `${timestamp} logLevel:${level} message:${message}`;
                  }
                ),
                dirname: 'logs/error',
                datePattern: "YYYY-MM-DD",
                filename: "errors_%DATE%.log"
              }),
              new WinstonDailyRotate({
                level: consts.DATA,
                format: winston.format.combine(
                  passData(),
                  winston.format.timestamp(),
                  winston.format.printf(
                    ({ level, message, timestamp }): string => {
                      return `${timestamp} level: ${level} message: ${message}`;
                      }
                  )
                ),
                dirname: 'logs',
                datePattern: "YYYY-MM-DD",
                filename: "data_%DATE%.log"
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
