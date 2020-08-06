import { Module, HttpModule } from '@nestjs/common';
import { LoggingModule } from '../logging/logging.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [LoggingModule, HttpModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
