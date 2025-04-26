import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma.service';
import { formatDateTimeToTimeZone } from 'src/utils/DateAsiaJakarta';

@Injectable()
export class OtpService {
  constructor(private prismaService: PrismaService) {}

  // Menggunakan decorator Cron untuk menjadwalkan penghapusan setiap menit
  @Cron('*/5 * * * *') // Menjalankan setiap 5 menit
  async removeExpiredOtp() {
    const timeJakarta: Date = new Date();

    console.log(timeJakarta);

    // Menghapus OTP yang sudah kedaluwarsa
    await this.prismaService.otp.deleteMany({
      where: {
        expiresAtOtp: {
          lt: formatDateTimeToTimeZone(timeJakarta), // Menghapus OTP yang kedaluwarsa
        },
      },
    });

    console.log('Pembersihan OTP selesai.');
  }
}
