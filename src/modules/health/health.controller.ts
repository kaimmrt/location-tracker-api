import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health.indicator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
  })
  @ApiResponse({
    status: 503,
    description: 'Health check failed',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
    return await this.health.check([
      // Database
      () => this.db.pingCheck('database'),

      // Memory (heap < 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // Disk (usage < 80%)
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.8,
        }),

      // Redis
      () => this.redis.isHealthy('redis'),
    ]);
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
  }
}
