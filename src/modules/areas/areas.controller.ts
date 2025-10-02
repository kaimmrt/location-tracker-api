import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaDto } from './dto/area-response.dto';
import { BaseResponse } from 'src/shared/base-response.dto';
import { LoggerService } from '../../shared/services/logger.service';

@ApiTags(AreasController.name)
@Controller('areas')
export class AreasController {
  constructor(
    private readonly areasService: AreasService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new geographical area' })
  @ApiResponse({
    status: 201,
    description: 'Area created successfully',
    type: BaseResponse<AreaDto>,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  public async create(
    @Body() body: CreateAreaDto,
  ): Promise<BaseResponse<AreaDto>> {
    this.logger.log(`POST /areas - Creating area: ${body.name}`,'AreasController');

    const area = await this.areasService.create(body);

    this.logger.log(`POST /areas - Area created successfully with ID: ${area.id}`,'AreasController');

    return {
      data: area,
      message: 'Area created successfully',
      userMessage: 'Geographical area has been created',
      isSuccess: true,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all geographical areas' })
  @ApiResponse({
    status: 200,
    description: 'List of all areas',
    type: BaseResponse<AreaDto[]>,
  })
  public async findAll(): Promise<BaseResponse<AreaDto[]>> {
    this.logger.log('GET /areas - Fetching all areas', 'AreasController');

    const areas = await this.areasService.findAll();

    this.logger.log(`GET /areas - Retrieved ${areas.length} areas`,'AreasController');

    if (areas.length === 0) {
      return {
        data: areas,
        message: 'No areas found',
        userMessage: 'No geographical areas are currently available',
        isSuccess: true,
      };
    }

    return {
      data: areas,
      message: 'Areas retrieved successfully',
      userMessage: 'Geographical areas have been retrieved',
      isSuccess: true,
    };
  }
}
