import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OtpService } from './cronjob.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Import ScheduleModule
  ],
  providers: [OtpService], // Masukkan service yang akan digunakan untuk pembersihan OTP
})
export class OtpModule {}
