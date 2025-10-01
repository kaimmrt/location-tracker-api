import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostLocationDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  public userId!: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.712,
  })
  @IsNumber()
  public lat!: number;

  @ApiProperty({
    description: 'Longitude co  ordinate',
    example: -74.006,
  })
  @IsNumber()
  public lon!: number;
}
