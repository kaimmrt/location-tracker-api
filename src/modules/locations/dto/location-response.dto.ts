import { ApiProperty } from '@nestjs/swagger';
import { AreaDto } from '../../../modules/areas/dto/area-response.dto';
import { EntryEventEnum } from '../../../shared/entry-event.enum';

export class LocationEventDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public userId!: string;

  @ApiProperty({
    description: 'Area ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  public areaId!: string;

  @ApiProperty({
    description: 'Event type',
    enum: EntryEventEnum,
    example: EntryEventEnum.ENTER,
  })
  public event!: EntryEventEnum;
}

export class LocationProcessResultDto {
  @ApiProperty({
    description: 'Areas containing the location',
    type: [AreaDto],
  })
  public areas!: AreaDto[];

  @ApiProperty({
    description: 'Events triggered by the location',
    type: [LocationEventDto],
  })
  public events!: LocationEventDto[];
}
