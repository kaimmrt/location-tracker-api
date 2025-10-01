import { ApiProperty } from '@nestjs/swagger';

export class AreaDto {
  @ApiProperty({
    description: 'Area ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public id!: string;

  @ApiProperty({
    description: 'Name of the geographical area',
    example: 'Office Building',
  })
  public name!: string;

  @ApiProperty({
    description: 'GeoJSON Polygon representing the area boundaries',
    example: `
      {"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}
    `,
  })
  public polygon!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  public createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  public updatedAt!: Date;
}
