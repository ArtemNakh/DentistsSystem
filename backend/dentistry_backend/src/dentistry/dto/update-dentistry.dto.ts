import { IsOptional, IsString } from 'class-validator';

export class UpdateDentistryDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  region?: string;
}
