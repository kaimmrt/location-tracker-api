import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class PostLocationDto {
  @IsUUID()
  @IsNotEmpty()
  public userId!: string;

  @IsNumber()
  public lat!: number;

  @IsNumber()
  public lon!: number;
}
