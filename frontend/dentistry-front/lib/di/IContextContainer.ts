import { ClientEntity } from "../redux/modules/Clients/ClientEntity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Specialties.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/Appointment.Entity";
import { PaymentEntity } from "../redux/modules/Payments/Payments.Entity";
import { AuthEntity } from "../redux/modules/AuthUser/AuthUser.Entity";

export interface IContexContainer {
  ClientEntity: ClientEntity;
  DentistryEntity: DentistryEntity;
  WorkerEntity: WorkerEntity;
  SpecialtyEntity: SpecialtyEntity;
  AppointmentEntity: AppointmentEntity;
  PaymentEntity: PaymentEntity;
  AuthEntity: AuthEntity;
}
