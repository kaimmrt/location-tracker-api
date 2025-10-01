import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTrackedEntity } from './base.entity';

@Entity({ name: 'areas' })
export class Area extends BaseTrackedEntity {
  @ApiProperty({
    description: 'Name of the geographical area',
    example: 'Office Building',
  })
  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @ApiProperty({
    description: 'GeoJSON Polygon representing the area boundaries',
    example: `
      {"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}
    `,
  })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  public polygon!: string;
}
