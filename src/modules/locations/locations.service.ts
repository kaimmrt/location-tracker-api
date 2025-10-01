import { Injectable } from '@nestjs/common';
import { PostLocationDto } from './dto/post-location.dto';
import { LocationRepository } from '../../repositories/location.repository';

@Injectable()
export class LocationsService {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async ingest(dto: PostLocationDto) {
    await this.locationRepository.createFromLatLon(
      dto.userId,
      dto.lat,
      dto.lon,
    );
    return { ok: true };
  }
}
