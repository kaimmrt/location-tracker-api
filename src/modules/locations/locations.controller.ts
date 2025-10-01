import { Body, Controller, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PostLocationDto } from './dto/post-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  public async create(@Body() body: PostLocationDto): Promise<{ ok: boolean }> {
    return await this.locationsService.ingest(body);
  }
}
