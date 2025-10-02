import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaRepository } from '../../repositories/area.repository';
import { LoggerService } from '../../shared/services/logger.service';
import { CacheService } from '../../shared/services/cache.service';
import { Area } from '../../entities/area.entity';
import { CACHE_TTL, CACHE_KEYS } from '../../shared/constants/cache.constants';

@Injectable()
export class AreasService {
  constructor(
    private readonly areaRepo: AreaRepository,
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
  ) {}

  public async create(dto: CreateAreaDto) {
    this.logger.log(`Creating new area: ${dto.name}`, 'AreasService');

    const area = await this.areaRepo.createWithPolygon(
      dto.name,
      dto.coordinates,
    );

    await this.cacheService.del(CACHE_KEYS.AREAS_ALL);

    this.logger.logAreaCreation(dto.name);
    this.logger.log(
      `Area created successfully with ID: ${area.id}`,
      'AreasService',
    );

    return area;
  }

  public async findAll() {
    this.logger.log('Fetching all areas', 'AreasService');

    // Try to get from cache first
    const cacheKey = CACHE_KEYS.AREAS_ALL;
    const cachedAreas = await this.cacheService.get<Area[]>(cacheKey);

    if (cachedAreas) {
      this.logger.log(
        `Retrieved ${cachedAreas.length} areas from cache`,
        'AreasService',
      );
      return cachedAreas;
    }

    // If not in cache, fetch from database
    const areas = await this.areaRepo.findAll();

    await this.cacheService.set(cacheKey, areas, CACHE_TTL.AREAS);

    this.logger.log(
      `Retrieved ${areas.length} areas from database and cached`,
      'AreasService',
    );

    return areas;
  }
}
