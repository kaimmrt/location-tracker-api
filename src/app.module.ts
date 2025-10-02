import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './modules/areas/areas.module';
import { LocationsModule } from './modules/locations/locations.module';
import { HealthModule } from './modules/health/health.module';
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware';
import { LoggingMiddleware } from './shared/middleware/logging.middleware';
import { LoggerService } from './shared/services/logger.service';
import { CacheService } from './shared/services/cache.service';
import { CACHE_TTL } from './shared/constants/cache.constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_TTL.DEFAULT,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          ssl: false,
        };
        return options;
      },
    }),
    AreasModule,
    LocationsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, CacheService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggingMiddleware).forRoutes('*');
  }
}
