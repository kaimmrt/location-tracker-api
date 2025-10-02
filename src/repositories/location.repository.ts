import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  constructor(
    @InjectRepository(Location)
    locationRepo: Repository<Location>,
  ) {
    super(locationRepo);
  }

  public async createFromLatLon(
    userId: string,
    lat: number,
    lon: number,
  ): Promise<Location> {
    const point = {
      type: 'Point',
      coordinates: [lon, lat],
    } as unknown as Location['point'];

    const entity = this.create({ userId, point } as Partial<Location>);

    return this.save(entity);
  }
}
