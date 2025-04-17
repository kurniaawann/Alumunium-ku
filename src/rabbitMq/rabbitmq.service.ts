import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RabbitMqService {
  private client: ClientProxy;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  producer(queue: string): void {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_SERVER')],
        queue: queue,
        queueOptions: {
          durable: true,
        },
      },
    });

    console.log(`RabbitMQ client initialized for queue: ${queue}`);
  }

  // Fungsi untuk mengirim pesan ke queue
  sendMessage(pattern: string, message: string): void {
    this.client.emit(pattern, message).subscribe({
      error: (error) =>
        this.logger.error(
          `Gagal Mengirimkan Pesan cuyy${JSON.stringify(error)}`,
        ),
    });
  }
}
