import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { FacilityModule } from './facility/facility.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getConfig().mongo.uri,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.getConfig().auth.publicKey,
      }),
    }),
    KafkaModule.forRootAsync(),
    ConfigModule.forRoot(),
    FacilityModule,
    AuthModule,
    TenantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/facility',
        method: RequestMethod.ALL,
      },
      {
        path: '/tenant',
        method: RequestMethod.ALL,
      },
    );
  }
}
