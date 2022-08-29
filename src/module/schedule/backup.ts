import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
export function backup(username: string, database: string, containerName: string, fileName: string, logger: Logger) {
    const shellCommand = `docker exec -t -u postgres ${containerName} pg_dump -U ${username} -d ${database} -F t -E UTF-8 > ${fileName}`
    exec(shellCommand, (err, stdout, stderr) => {
      if(err){
        logger.log(err);
        return;
      }
      if(stderr){
        logger.log(stderr);
        return;
      }
      logger.log(stdout);
    })
  }