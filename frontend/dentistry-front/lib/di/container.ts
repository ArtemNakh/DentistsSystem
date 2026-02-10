// import { ActorEntity } from "@/lib/Entities/ActorEntity";
// import { ActorRoleEntity } from "@/lib/Entities/ActorRoleEntity";
// import { AuthEntity } from "@/lib/Entities/AuthEntity";
// import { ReviewEntity } from "@/lib/Entities/ReviewEntity";
// import { UserEntity } from "@/lib/Entities/UserEntity";
// import { VideoEntity } from "@/lib/Entities/VideoEntity";
import { ClientEntity } from "../redux/modules/clients/ClientEntity";
// import ReduxStore from "@/lib/redux/store";

import { asClass, createContainer } from "awilix";
import { WorkerEntity } from "../redux/modules/Workers/Workers.Entity";
import { SpecialtyEntity } from "../redux/modules/Specialties/Specialties.Entity";
import { DentistryEntity } from "../redux/modules/Dentistries/Dentistry.Entity";

const clientContainer = createContainer({
  injectionMode: "PROXY",
});
const expansion = {
  //   AuthEntity: asClass(AuthEntity).singleton(),
  //   ReviewEntity: asClass(ReviewEntity).singleton(),
  //   VideoEntity: asClass(VideoEntity).singleton(),
  //   UserEntity: asClass(UserEntity).singleton(),
  //   ActorEntity: asClass(ActorEntity).singleton(),
  //   ActorRoleEntity: asClass(ActorRoleEntity).singleton(),
  ClientEntity: asClass(ClientEntity).singleton(),
  DentistryEntity: asClass(DentistryEntity).singleton(),
  WorkerEntity: asClass(WorkerEntity).singleton(),
  SpecialtyEntity: asClass(SpecialtyEntity).singleton(),

  // redux: asClass(ReduxStore).singleton(),
};

clientContainer.register({ ...expansion });

export default clientContainer;
