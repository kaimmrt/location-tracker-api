import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreaRepository extends BaseRepository<Area> {
  constructor(
    @InjectRepository(Area)
    areaRepo: Repository<Area>,
  ) {
    super(areaRepo);
  }

  public async createWithPolygon(name: string, polygon: string): Promise<Area> {
    const area = this.create({ name, polygon });
    return this.save(area);
  }
}
