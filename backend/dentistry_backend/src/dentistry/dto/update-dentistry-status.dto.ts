import { IsBoolean } from 'class-validator';

export class UpdateDentistryStatusDto {
  @IsBoolean()
  isActive: boolean;
}
