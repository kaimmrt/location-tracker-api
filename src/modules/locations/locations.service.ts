import { Injectable } from '@nestjs/common';
import { PostLocationDto } from './dto/post-location.dto';
import { LocationRepository } from '../../repositories/location.repository';
import { AreaRepository } from '../../repositories/area.repository';
import { UserAreaStateRepository } from '../../repositories/user-area-state.repository';
import { EntryLogRepository } from '../../repositories/entry-log.repository';
import { EntryEventEnum } from '../../shared/entry-event.enum';
import { LoggerService } from '../../shared/services/logger.service';
import { Area } from '../../entities/area.entity';
import { UserAreaState } from '../../entities/user-area-state.entity';

@Injectable()
export class LocationsService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly areaRepository: AreaRepository,
    private readonly userAreaStateRepository: UserAreaStateRepository,
    private readonly entryLogRepository: EntryLogRepository,
    private readonly logger: LoggerService,
  ) {}

  public async processLocation(dto: PostLocationDto) {
    this.logger.log('Starting location processing', 'LocationsService');

    await this.locationRepository.createFromLatLon(
      dto.userId,
      dto.lat,
      dto.lon,
    );

    const areas = await this.findContainingAreas(dto.lon, dto.lat);

    const logEntries = await this.processAreaEvents(dto.userId, areas);

    this.logger.log(
      `Location processed - User: ${dto.userId}, Lat: ${dto.lat}, Lon: ${dto.lon}, Areas: ${areas.length}, Events: ${logEntries.length}`,
      'LocationsService',
    );

    this.logger.log(
      'Location processing completed successfully',
      'LocationsService',
    );

    return { ok: true, areas, events: logEntries };
  }

  private async findContainingAreas(lon: number, lat: number): Promise<Area[]> {
    const areas = await this.areaRepository.findContainingPoint(lon, lat);

    this.logger.log(
      `Found ${areas.length} areas containing the point`,
      'LocationsService',
    );

    return areas;
  }

  private async processAreaEvents(userId: string, newAreas: Area[]) {
    const userStates = await this.userAreaStateRepository.findByUserId(userId);

    const { enteringAreas, exitingAreas } = this.identifyAreaChanges(
      userStates,
      newAreas,
    );

    this.logger.log(
      `User entering ${enteringAreas.length} areas, exiting ${exitingAreas.length} areas`,
      'LocationsService',
    );

    const logEntries = await this.handleAreaStateChanges(
      userId,
      enteringAreas,
      exitingAreas,
    );

    return logEntries;
  }

  private identifyAreaChanges(userStates: UserAreaState[], newAreas: Area[]) {
    const currentAreaIds = new Set(userStates.map((state) => state.areaId));
    const newAreaIds = new Set(newAreas.map((area) => area.id));

    const enteringAreas = newAreas.filter(
      (area) => !currentAreaIds.has(area.id),
    );
    const exitingAreas = userStates.filter(
      (state) => state.isInside && !newAreaIds.has(state.areaId),
    );

    return { enteringAreas, exitingAreas };
  }

  private async handleAreaStateChanges(
    userId: string,
    enteringAreas: Area[],
    exitingAreas: UserAreaState[],
  ) {
    const logEntries = [];

    for (const area of enteringAreas) {
      await this.userAreaStateRepository.upsertState(userId, area.id, true);
      logEntries.push({
        userId,
        areaId: area.id,
        event: EntryEventEnum.ENTER,
      });
    }

    for (const state of exitingAreas) {
      await this.userAreaStateRepository.upsertState(
        userId,
        state.areaId,
        false,
      );
      logEntries.push({
        userId,
        areaId: state.areaId,
        event: EntryEventEnum.EXIT,
      });
    }

    if (logEntries.length > 0) {
      await this.logEntryEvents(logEntries);
    }

    return logEntries;
  }

  private async logEntryEvents(
    logEntries: Array<{
      userId: string;
      areaId: string;
      event: EntryEventEnum;
    }>,
  ): Promise<void> {
    try {
      await this.entryLogRepository.insertManyEnterExit(logEntries);
      this.logger.log(
        `Successfully logged ${logEntries.length} entry events`,
        'LocationsService',
      );
    } catch {
      this.logger.error('Failed to log entry events', 'LocationsService');
    }
  }
}
