import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from '../../entities/area.entity';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AreaRepository } from '../../repositories/area.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  controllers: [AreasController],
  providers: [AreasService, AreaRepository],
  exports: [AreasService, AreaRepository],
})
export class AreasModule {}
