import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redis: Redis;

  constructor(private readonly logger: LoggerService) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
    });
  }

  public async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.redis.get(key);
      if (value) {
        this.logger.log(`Cache HIT for key: ${key}`, 'CacheService');
        return JSON.parse(value) as T;
      } else {
        this.logger.log(`Cache MISS for key: ${key}`, 'CacheService');
        return undefined;
      }
    } catch (error) {
      this.logger.log(
        `Cache GET error for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
      return undefined;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      this.logger.log(
        `Cache SET for key: ${key} with TTL: ${ttl || 'default'}`,
        'CacheService',
      );
    } catch (error) {
      this.logger.log(
        `Cache SET error for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.log(`Cache DELETE for key: ${key}`, 'CacheService');
    } catch (error) {
      this.logger.log(
        `Cache DELETE error for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
    }
  }

  public async delMultiple(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      this.logger.log(
        `Cache DELETE MULTIPLE for keys: ${keys.join(', ')}`,
        'CacheService',
      );
    } catch (error) {
      this.logger.log(
        `Cache DELETE MULTIPLE error for keys ${keys.join(', ')}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
    }
  }

  public async reset(): Promise<void> {
    try {
      await this.redis.flushall();
      this.logger.log('Cache RESET - All cache cleared', 'CacheService');
    } catch (error) {
      this.logger.log(
        `Cache RESET error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.log(
        `Cache HAS error for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CacheService',
      );
      return false;
    }
  }
}
