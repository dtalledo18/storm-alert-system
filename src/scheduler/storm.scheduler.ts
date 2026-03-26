import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from '../app.service';

@Injectable()
export class StormScheduler {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkForStorms() {
    console.log(`[CRON] Revisando alertas de tormenta...`);
    await this.appService.runStormProtocol();
  }
}
