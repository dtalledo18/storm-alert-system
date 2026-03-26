import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherService } from './weather/weather.service';
import { SmsService } from './sms/sms.service';
import { ScheduleModule } from '@nestjs/schedule';
import { StormScheduler } from './scheduler/storm.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // Esto carga tu archivo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, WeatherService, SmsService, StormScheduler],
})
export class AppModule {}
