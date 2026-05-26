import { Expose, Type } from 'class-transformer';
import { WorkerShiftFullDto } from '@/worker-shifts/dto/Response/BaseType/WorkerShiftFull.response.dto';
import { SpecialtyFullDto } from '@/specialty/dto/Response/BaseType/SpecialtyFull.response.dto';
import { AppointmentFullDto } from '@/appointment/dto/Response/BaseType/AppointmentFull.response.dto';
import { DentistryFullDto } from '@/dentistry/dto/Response/BaseType/DentistryFull.response.dto';
import { LicenseFullDto } from '@/license/dto/Response/BaseType/LicenseFull.response.dto';

export class WorkerFullDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  middle_name: string;

  @Expose()
  birthday: Date;

  @Expose()
  phone: string;

  @Expose()
  active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Type(() => SpecialtyFullDto)
  @Expose()
  specialty: SpecialtyFullDto;

  @Expose()
  login: string;

  @Type(() => DentistryFullDto)
  @Expose()
  dentistry: DentistryFullDto;

  @Type(() => LicenseFullDto)
  @Expose()
  licenses: LicenseFullDto[];

  @Type(() => AppointmentFullDto)
  @Expose()
  appointments: AppointmentFullDto[];

  @Type(() => WorkerShiftFullDto)
  @Expose()
  shifts: WorkerShiftFullDto[];
}
