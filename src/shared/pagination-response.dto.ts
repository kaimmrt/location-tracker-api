import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  public page!: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  public limit!: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  public total!: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  public totalPages!: number;

  @ApiProperty({ description: 'Number of items in current page', example: 10 })
  public itemCount!: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  public hasNextPage!: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  public hasPreviousPage!: boolean;
}

export class PaginationResponse<T> {
  @ApiProperty({ description: 'Response data array' })
  public data!: T[];

  @ApiProperty({
    description: 'Response message',
    example: 'Data retrieved successfully',
  })
  public message!: string;

  @ApiProperty({
    description: 'User-friendly message',
    example: 'Data has been retrieved',
  })
  public userMessage!: string;

  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  public isSuccess!: boolean;

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  public meta!: PaginationMeta;
}
