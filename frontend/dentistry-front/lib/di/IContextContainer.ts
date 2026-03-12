import { ClientEntity } from "../redux/modules/Clients/ClientEntity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Specialties.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/Appointment.Entity";
import { PaymentEntity } from "../redux/modules/Payments/Payments.Entity";
import { AuthEntity } from "../redux/modules/AuthUser/AuthUser.Entity";
import { AppointmentActionsEntity } from "../redux/modules/AppointmentsActions/AppointmentActions.Entity";
import { OperationListEntity } from "../redux/modules/OperationList/OperationList.Entity";
import { FindingWorkerEntity } from "../redux/modules/FindingWorkers/FindingWorkerEntity";
import { WorkerShiftsEntity } from "../redux/modules/WorkerShifts/WorkerShifts.Entity";

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
  WorkerShiftsEntity:WorkerShiftsEntity;
}
