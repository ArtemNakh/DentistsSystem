// import { ActorEntity } from "@/lib/Entities/ActorEntity";
// import { ActorRoleEntity } from "@/lib/Entities/ActorRoleEntity";
// import { AuthEntity } from "@/lib/Entities/AuthEntity";
// import { ReviewEntity } from "@/lib/Entities/ReviewEntity";
// import { UserEntity } from "@/lib/Entities/UserEntity";
// import { VideoEntity } from "@/lib/Entities/VideoEntity";
import { ClientEntity } from "../redux/modules/clients/ClientEntity";

import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Specialties.Entity";
import { AppointmentEntity } from "../redux/modules/Appointments/AppointmentEntity";

export interface IContexContainer {
  //   AuthEntity: AuthEntity;
  //   ReviewEntity: ReviewEntity;
  //   VideoEntity: VideoEntity;
  //   UserEntity:UserEntity;
  //   ActorEntity:ActorEntity;
  //   ActorRoleEntity:ActorRoleEntity;
  ClientEntity: ClientEntity;
  DentistryEntity: DentistryEntity;
  WorkerEntity: WorkerEntity;
  SpecialtyEntity: SpecialtyEntity;
  AppointmentEntity: AppointmentEntity;
}
