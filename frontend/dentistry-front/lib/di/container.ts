import { ClientEntity } from "../redux/modules/Clients/ClientEntity";

import { asClass, createContainer } from "awilix";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Specialties.Entity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/Appointment.Entity";
import { PaymentEntity } from "../redux/modules/Payments/Payments.Entity";
import { AuthEntity } from "../redux/modules/AuthUser/AuthUser.Entity";
import { AppointmentActionsEntity } from "../redux/modules/AppointmentsActions/AppointmentActions.Entity";
import { OperationListEntity } from "../redux/modules/OperationList/OperationList.Entity";
import { FindingWorkerEntity } from "../redux/modules/FindingWorkers/FindingWorkerEntity";
import { WorkerShiftsEntity } from "../redux/modules/WorkerShifts/WorkerShifts.Entity";

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
};

clientContainer.register({ ...expansion });

export default clientContainer;
