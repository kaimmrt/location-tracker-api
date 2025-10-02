import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from '../../entities/area.entity';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AreaRepository } from '../../repositories/area.repository';
import { LoggerService } from '../../shared/services/logger.service';
import { CacheService } from '../../shared/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  controllers: [AreasController],
  providers: [AreasService, AreaRepository, LoggerService, CacheService],
  exports: [AreasService, AreaRepository],
})
export class AreasModule {}
