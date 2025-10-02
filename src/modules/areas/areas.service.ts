import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaRepository } from '../../repositories/area.repository';
import { LoggerService } from '../../shared/services/logger.service';
import { CacheService } from '../../shared/services/cache.service';
import { CACHE_KEYS } from '../../shared/constants/cache.constants';

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

    this.logger.log(
      `Area created successfully - Name: ${dto.name}, ID: ${area.id}`,
      'AreasService',
    );

    return area;
  }

  public async findAll(
    options: { limit: number; offset: number } = { limit: 100, offset: 0 },
  ) {
    this.logger.log(
      `Fetching areas with limit: ${options.limit}, offset: ${options.offset}`,
      'AreasService',
    );

    // For pagination, we'll always fetch from database to ensure accurate results
    const [areas, total] = await this.areaRepo.findAllWithPaginationAndCount(
      options.limit,
      options.offset,
    );

    this.logger.log(
      `Retrieved ${areas.length} areas from database (total: ${total})`,
      'AreasService',
    );

    return { areas, total };
  }
}
