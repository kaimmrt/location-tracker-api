import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({
    description: 'Response data',
  })
  public data!: T;

  @ApiProperty({
    description: 'Technical message for developers',
    example: 'Location processed successfully',
  })
  public message!: string;

  @ApiProperty({
    description: 'User-friendly message',
    example: 'Your location has been processed',
  })
  public userMessage!: string;

  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
  })
  public isSuccess!: boolean;
}
