import { Logger, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Config } from '../config/config.interface';

export class LoggingService extends Logger {
  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
  ) {
    super();
  }

  warn(warning: any, context = ''): void {
    super.warn(warning, context);
    this.logOnKafka(warning);
  }

  error(err: any, trace = '', context = ''): void {
    let msg = '';
    if (err instanceof Error) {
      msg = `${err.message}\n${err.stack}`;
      super.error(msg, context);
    } else {
      msg = err;
      if (trace) {
        msg += `\n${trace}`;
      }
      super.error(msg, context);
    }
    this.logOnKafka(msg);
  }

  private logOnKafka(message: string) {
    const kafka = this.config.kafka;
    this.kafkaClient.emit(`${kafka.prefix}-${kafka.clientId}-log`, message);
  }
}
