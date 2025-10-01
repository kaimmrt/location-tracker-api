import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaDto } from './dto/area-response.dto';
import { BaseResponse } from 'src/shared/base-response.dto';

@ApiTags(AreasController.name)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

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
    const area = await this.areasService.create(body);
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
    const areas = await this.areasService.findAll();
    return {
      data: areas,
      message: 'Areas retrieved successfully',
      userMessage: 'Geographical areas have been retrieved',
      isSuccess: true,
    };
  }
}
