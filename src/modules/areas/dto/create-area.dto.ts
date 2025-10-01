import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({
    description: 'Name of the geographical area',
    example: 'Office Building',
  })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({
    description: 'GeoJSON Polygon representing the area boundaries',
    example: '{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}',
  })
  @IsString()
  @IsNotEmpty()
  public polygon!: string;
}
