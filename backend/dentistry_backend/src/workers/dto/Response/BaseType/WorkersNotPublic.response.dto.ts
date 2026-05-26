import { Expose, Type } from 'class-transformer';
import { WorkerShiftFullDto } from '@/worker-shifts/dto/Response/BaseType/WorkerShiftFull.response.dto';
import { SpecialtyFullDto } from '@/specialty/dto/Response/BaseType/SpecialtyFull.response.dto';
import { AppointmentFullDto } from '@/appointment/dto/Response/BaseType/AppointmentFull.response.dto';
import { DentistryFullDto } from '@/dentistry/dto/Response/BaseType/DentistryFull.response.dto';
import { LicenseFullDto } from '@/license/dto/Response/BaseType/LicenseFull.response.dto';
import { LicensePublicDto } from '@/license/dto/Response/BaseType/LicensePublic.response.dto';
import { WorkerShiftPublicDto } from '@/worker-shifts/dto/Response/BaseType/WorkerShiftPublic.response.dto';
import { AppointmentPublicDto } from '@/appointment/dto/Response/BaseType/AppointmentPublic.response.dto';
import { DentistryPublicDto } from '@/dentistry/dto/Response/BaseType/DentistryPublic.response.dto';
import { SpecialtyPublicDto } from '@/specialty/dto/Response/BaseType/SpecialtyPublic.response.dto';

export class WorkerNotPublicDto {
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

  @Type(() => SpecialtyPublicDto)
  @Expose()
  specialty: SpecialtyPublicDto;

  @Type(() => DentistryPublicDto)
  @Expose()
  dentistry: DentistryPublicDto;

  @Type(() => LicensePublicDto)
  @Expose()
  licenses: LicensePublicDto[];

  @Type(() => AppointmentPublicDto)
  @Expose()
  appointments: AppointmentPublicDto[];

  @Type(() => WorkerShiftPublicDto)
  @Expose()
  shifts: WorkerShiftPublicDto[];
}
