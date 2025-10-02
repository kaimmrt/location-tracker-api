import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import RedisConstructor, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisHealthIndicator {
  private readonly redis: RedisClient;

  constructor(private readonly healthIndicatorService: HealthIndicatorService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.redis = new RedisConstructor({
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
  }

  async isHealthy(key: string) {
    // healthIndicatorService.check(key) sana bir “indicator” objesi verir
    const indicator = this.healthIndicatorService.check(key);

    try {
      const start = Date.now();
      await (this.redis as unknown as { ping: () => Promise<string> }).ping();
      const responseTime = Date.now() - start;

      return indicator.up({
        responseTime: `${responseTime}ms`,
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || '6379',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return indicator.down({
        error: message,
      });
    }
  }
}
