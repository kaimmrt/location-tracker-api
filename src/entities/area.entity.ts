import { Column, Entity } from 'typeorm';
import { BaseTrackedEntity } from './base.entity';

@Entity({ name: 'areas' })
export class Area extends BaseTrackedEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326 })
  polygon!: string;
}
