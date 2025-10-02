import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';
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
    description: 'Polygon coordinates array [[[lon, lat], [lon, lat], ...]]',
    example: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
    type: 'array', items: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
      },
    },
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  public coordinates!: number[][][];
}
