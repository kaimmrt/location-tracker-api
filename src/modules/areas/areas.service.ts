import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaRepository } from '../../repositories/area.repository';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class AreasService {
  constructor(
    private readonly areaRepo: AreaRepository,
    private readonly logger: LoggerService,
  ) {}

  public async create(dto: CreateAreaDto) {
    this.logger.log(`Creating new area: ${dto.name}`, 'AreasService');
    
    const area = await this.areaRepo.createWithPolygon(dto.name, dto.polygon);
    
    this.logger.logAreaCreation(dto.name);
    this.logger.log(`Area created successfully with ID: ${area.id}`, 'AreasService');
    
    return area;
  }

  public async findAll() {
    this.logger.log('Fetching all areas', 'AreasService');
    
    const areas = await this.areaRepo.findAll();
    
    this.logger.log(`Retrieved ${areas.length} areas`, 'AreasService');
    
    return areas;
  }
}