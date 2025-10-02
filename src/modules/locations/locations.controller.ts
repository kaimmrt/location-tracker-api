import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { PostLocationDto } from './dto/post-location.dto';
import { BaseResponse } from 'src/shared/base-response.dto';
import { LocationProcessResultDto } from './dto/location-response.dto';

@ApiTags(LocationsController.name)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit user location and check' })
  @ApiResponse({
    status: 200,
    description: 'Location processed successfully',
    type: BaseResponse<LocationProcessResultDto>,
  })
  @ApiResponse({ status: 400, description: 'Invalid location data' })
  public async create(
    @Body() body: PostLocationDto,
  ): Promise<BaseResponse<LocationProcessResultDto>> {
    const result = await this.locationsService.processLocation(body);

    return {
      data: {
        areas: result.areas,
        events: result.events,
      },
      message: 'Location processed successfully',
      userMessage: 'Your location has been processed and checked',
      isSuccess: true,
    };
  }
}
