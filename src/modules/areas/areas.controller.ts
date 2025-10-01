import { Body, Controller, Get, Post } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { Area } from '../../entities/area.entity';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  public create(@Body() body: CreateAreaDto): Promise<Area> {
    return this.areasService.create(body);
  }

  @Get()
  public findAll(): Promise<Area[]> {
    return this.areasService.findAll();
  }
}
