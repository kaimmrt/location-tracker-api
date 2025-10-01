import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from '../../entities/location.entity';
import { Area } from '../../entities/area.entity';
import { UserAreaState } from '../../entities/user-area-state.entity';
import { EntryLog } from '../../entities/entry-log.entity';
import { LocationRepository } from '../../repositories/location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Area, UserAreaState, EntryLog]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService, LocationRepository],
})
export class LocationsModule {}
