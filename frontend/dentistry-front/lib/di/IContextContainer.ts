import { ClientEntity } from "../redux/modules/Clients/ClientEntity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Entities/Specialties/Specialties.Entity";

import { PaymentEntity } from "../redux/modules/Payments/Payments.Entity";
import { AuthEntity } from "../redux/modules/AuthUser/AuthUser.Entity";
import { AppointmentActionsEntity } from "../redux/modules/AppointmentsActions/AppointmentActions.Entity";
import { OperationListEntity } from "../redux/modules/OperationList/OperationList.Entity";
import { FindingWorkerEntity } from "../redux/modules/FindingWorkers/FindingWorkerEntity";
import { WorkerShiftsEntity } from "../redux/modules/WorkerShifts/WorkerShifts.Entity";
import { WorkerStatsEntity } from "../redux/modules/ADMINS/Stats/WorkerStats/WorkerStats.entity";
import { WorkerWeekendEntity } from "../redux/modules/ADMINS/Stats/WeekendStats/actions/WeekendStats.entity";
import { FindingSpecialtyEntity } from "../redux/modules/Specialties/Entities/FindedSpecialties/FindedSpecialties.Entity";
import { LicensesEntity } from "../redux/modules/Licenses/Licenses.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/Appointments.Entity";
import { FindingDentistryEntity } from "../redux/modules/FindingDentistries/FindingDentistry.Entity";
import { NotificationEntity } from "../redux/modules/Notifications/Notification.Entity";

export interface IContexContainer {
  ClientEntity: ClientEntity;
  DentistryEntity: DentistryEntity;
  WorkerEntity: WorkerEntity;
  SpecialtyEntity: SpecialtyEntity;
  AppointmentEntity: AppointmentEntity;
  PaymentEntity: PaymentEntity;
  AuthEntity: AuthEntity;
  AppointmentActionsEntity: AppointmentActionsEntity;
  OperationListEntity: OperationListEntity;
  FindingWorkersEntity: FindingWorkerEntity;
  WorkerShiftsEntity: WorkerShiftsEntity;
  WorkerStatsEntity: WorkerStatsEntity;
  WorkerWeekendEntity: WorkerWeekendEntity;
  FindingSpecialtiesEntity: FindingSpecialtyEntity;
  LicensesEntity: LicensesEntity;
  FindingDentistryEntity: FindingDentistryEntity;
  NotificationEntity: NotificationEntity;
}
