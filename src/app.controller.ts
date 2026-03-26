import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('alerts')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('trigger')
  async trigger() {
    return await this.appService.runStormProtocol();
  }
}
