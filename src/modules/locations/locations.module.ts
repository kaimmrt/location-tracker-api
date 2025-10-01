import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from '../../entities/location.entity';
import { Area } from '../../entities/area.entity';
import { UserAreaState } from '../../entities/user-area-state.entity';
import { EntryLog } from '../../entities/entry-log.entity';
import { LocationRepository } from '../../repositories/location.repository';
import { AreaRepository } from '../../repositories/area.repository';
import { UserAreaStateRepository } from '../../repositories/user-area-state.repository';
import { EntryLogRepository } from '../../repositories/entry-log.repository';
import { LoggerService } from '../../shared/services/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Area, UserAreaState, EntryLog]),
  ],
  controllers: [LocationsController],
  providers: [
    LocationsService,
    LocationRepository,
    AreaRepository,
    UserAreaStateRepository,
    EntryLogRepository,
    LoggerService,
  ],
})
export class LocationsModule {}
