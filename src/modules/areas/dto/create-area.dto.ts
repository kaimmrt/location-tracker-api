import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public polygon!: string;
}
