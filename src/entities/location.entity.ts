import { Column, Entity } from 'typeorm';
import { BaseTrackedEntity } from './base.entity';

@Entity({ name: 'locations' })
export class Location extends BaseTrackedEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  point!: string;
}
