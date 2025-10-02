import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaDto } from './dto/area-response.dto';
import { BaseResponse } from 'src/shared/base-response.dto';
import { PaginationResponse } from 'src/shared/pagination-response.dto';
import { LoggerService } from '../../shared/services/logger.service';
import {
  calculatePaginationMeta,
  normalizePaginationParams,
  createPaginatedResponse,
} from '../../shared/utils/pagination.util';

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
    this.logger.log(
      `POST /areas - Creating area: ${body.name}`,
      'AreasController',
    );

    const area = await this.areasService.create(body);

    this.logger.log(
      `POST /areas - Area created successfully with ID: ${area.id}`,
      'AreasController',
    );

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
    description: 'List of all areas with pagination',
    type: PaginationResponse<AreaDto>,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
  })
  public async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PaginationResponse<AreaDto>> {
    this.logger.log('GET /areas - Fetching all areas', 'AreasController');

    const { limit: limitValue, offset: offsetValue } =
      normalizePaginationParams(limit, offset);

    const { areas, total } = await this.areasService.findAll({
      limit: limitValue,
      offset: offsetValue,
    });

    this.logger.log(
      `GET /areas - Retrieved ${areas.length} areas`,
      'AreasController',
    );

    const meta = calculatePaginationMeta(
      limitValue,
      offsetValue,
      total,
      areas.length,
    );

    return createPaginatedResponse(
      areas,
      total,
      meta,
      'Areas retrieved successfully',
      'No areas found',
      'Geographical areas have been retrieved',
      'No geographical areas are currently available',
    );
  }
}
