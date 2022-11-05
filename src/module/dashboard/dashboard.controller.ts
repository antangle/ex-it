import { Controller, Post } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
    @Post()
    async test(){
        return 1;
    }
}