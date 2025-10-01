import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaRepository } from '../../repositories/area.repository';

@Injectable()
export class AreasService {
  constructor(private readonly areaRepo: AreaRepository) {}

  async create(dto: CreateAreaDto) {
    return this.areaRepo.createWithPolygon(dto.name, dto.polygon);
  }

  async findAll() {
    return this.areaRepo.findAll();
  }
}
