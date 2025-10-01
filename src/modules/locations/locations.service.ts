import { Injectable } from '@nestjs/common';
import { PostLocationDto } from './dto/post-location.dto';
import { LocationRepository } from '../../repositories/location.repository';
import { AreaRepository } from '../../repositories/area.repository';
import { UserAreaStateRepository } from '../../repositories/user-area-state.repository';
import { EntryLogRepository } from '../../repositories/entry-log.repository';
import { EntryEventEnum } from '../../shared/entry-event.enum';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class LocationsService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly areaRepository: AreaRepository,
    private readonly userAreaStateRepository: UserAreaStateRepository,
    private readonly entryLogRepository: EntryLogRepository,
    private readonly logger: LoggerService,
  ) {}

  public async ingest(dto: PostLocationDto) {
    this.logger.log('Starting location ingestion', 'LocationsService');

    await this.locationRepository.createFromLatLon(
      dto.userId,
      dto.lat,
      dto.lon,
    );

    this.logger.log('Location saved to database', 'LocationsService');

    const areas = await this.areaRepository.findContainingPoint(
      dto.lon,
      dto.lat,
    );

    this.logger.log(
      `Found ${areas.length} areas containing the point`,
      'LocationsService',
    );

    const currentStates = await this.userAreaStateRepository.findAll();
    const userStates = currentStates.filter(
      (state) => state.userId === dto.userId,
    );

    const currentAreaIds = new Set(userStates.map((state) => state.areaId));
    const newAreaIds = new Set(areas.map((area) => area.id));

    // Find areas user is entering (new areas)
    const enteringAreas = areas.filter((area) => !currentAreaIds.has(area.id));

    // Find areas user is exiting (was inside, now outside)
    const exitingAreas = userStates.filter(
      (state) => state.isInside && !newAreaIds.has(state.areaId),
    );

    this.logger.log(
      `User entering ${enteringAreas.length} areas, exiting ${exitingAreas.length} areas`,
      'LocationsService',
    );

    // Update states and log events
    const logEntries = [];

    // Handle entering areas
    for (const area of enteringAreas) {
      await this.userAreaStateRepository.upsertState(dto.userId, area.id, true);
      logEntries.push({
        userId: dto.userId,
        areaId: area.id,
        event: EntryEventEnum.ENTER,
      });
    }

    // Handle exiting areas
    for (const state of exitingAreas) {
      await this.userAreaStateRepository.upsertState(
        dto.userId,
        state.areaId,
        false,
      );
      logEntries.push({
        userId: dto.userId,
        areaId: state.areaId,
        event: EntryEventEnum.EXIT,
      });
    }

    // Log all events
    if (logEntries.length > 0) {
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

    // Log location processing
    this.logger.logLocationProcess(
      dto.userId,
      dto.lat,
      dto.lon,
      areas.length,
      logEntries.length,
    );

    this.logger.log(
      'Location ingestion completed successfully',
      'LocationsService',
    );

    return { ok: true, areas, events: logEntries };
  }
}
