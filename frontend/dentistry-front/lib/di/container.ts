import { ClientEntity } from "../redux/modules/Clients/ClientEntity";

import { asClass, createContainer } from "awilix";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Entities/Specialties/Specialties.Entity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";

import { PaymentEntity } from "../redux/modules/Payments/Payments.Entity";
import { AuthEntity } from "../redux/modules/AuthUser/AuthUser.Entity";
import { AppointmentActionsEntity } from "../redux/modules/AppointmentsActions/AppointmentActions.Entity";
import { OperationListEntity } from "../redux/modules/OperationList/OperationList.Entity";
import { FindingWorkerEntity } from "../redux/modules/FindingWorkers/FindingWorkerEntity";
import { WorkerShiftsEntity } from "../redux/modules/WorkerShifts/WorkerShifts.Entity";
import { WorkerStatsEntity } from "../redux/modules/ADMINS/Stats/WorkerStats/WorkerStats.entity";
import {
  WorkerWeekendActionSaga,
  WorkerWeekendEntity,
} from "../redux/modules/ADMINS/Stats/WeekendStats/actions/WeekendStats.entity";
import { FindingSpecialtyEntity } from "../redux/modules/Specialties/Entities/FindedSpecialties/FindedSpecialties.Entity";
import { LicensesEntity } from "../redux/modules/Licenses/Licenses.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/Appointments.Entity";
import { FindingOperationListEntity } from "../redux/modules/FindingOperationList/OperationList/FindingOperationList.Entity";
import { FindingDentistryEntity } from "../redux/modules/FindingDentistries/FindingDentistry.Entity";
import { NotificationEntity } from "../redux/modules/Notifications/Notification.Entity";

const clientContainer = createContainer({
  injectionMode: "PROXY",
});
const expansion = {
  ClientEntity: asClass(ClientEntity).singleton(),
  DentistryEntity: asClass(DentistryEntity).singleton(),
  WorkerEntity: asClass(WorkerEntity).singleton(),
  SpecialtyEntity: asClass(SpecialtyEntity).singleton(),
  AppointmentEntity: asClass(AppointmentEntity).singleton(),
  PaymentEntity: asClass(PaymentEntity).singleton(),
  AuthEntity: asClass(AuthEntity).singleton(),
  AppointmentActionsEntity: asClass(AppointmentActionsEntity).singleton(),
  OperationListEntity: asClass(OperationListEntity).singleton(),
  FindingWorkersEntity: asClass(FindingWorkerEntity).singleton(),
  WorkerShiftsEntity: asClass(WorkerShiftsEntity).singleton(),
  WorkersStatsEntity: asClass(WorkerStatsEntity).singleton(),
  WorkerWeekendEntity: asClass(WorkerWeekendEntity).singleton(),
  FindingSpecialtyEntity: asClass(FindingSpecialtyEntity).singleton(),
  LicensesEntity: asClass(LicensesEntity).singleton(),
  FindingOperationListEntity: asClass(FindingOperationListEntity).singleton(),
  FindingDentistries: asClass(FindingDentistryEntity).singleton(),
  NotificationEntity: asClass(NotificationEntity).singleton(),
};

clientContainer.register({ ...expansion });

export default clientContainer;
