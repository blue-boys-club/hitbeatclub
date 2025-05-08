import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor() {}

    // health check
    @Get('health')
    healthCheck(): string {
        return 'ok';
    }
}
