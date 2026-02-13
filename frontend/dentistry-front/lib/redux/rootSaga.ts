// // rootSaga.ts
// import { all } from "redux-saga/effects";
// import { sagasRegistry } from "./registry";

// export function* rootSaga() {
//   yield all(sagasRegistry.map((entity) => entity.watch()));
// }

// //new
// import clientContainer from "@/client/di/container";
import clientContainer from "../di/container";
import { all } from "redux-saga/effects";

export function* rootSaga() {
  // const videoEntitySaga = clientContainer.resolve("VideoEntity");
  // const reviewEntitySaga = clientContainer.resolve("ReviewEntity");
  // const authEntitySaga = clientContainer.resolve("AuthEntity");

  // const actorEntitySaga = clientContainer.resolve("ActorEntity");
  // const actorRoleEntitySaga = clientContainer.resolve("ActorRoleEntity");
  // const userEntitySaga = clientContainer.resolve("UserEntity");
  const clientEntitySaga = clientContainer.resolve("ClientEntity");
  const dentistryEntitySaga = clientContainer.resolve("DentistryEntity");
  const workerEntitySaga = clientContainer.resolve("WorkerEntity");
  const specialtyEntitySaga = clientContainer.resolve("SpecialtyEntity");
  const appointmentEntitySaga=clientContainer.resolve("AppointmentEntity")
  yield all([
    clientEntitySaga.watch(),
    dentistryEntitySaga.watch(),
    workerEntitySaga.watch(),
    specialtyEntitySaga.watch(),
    appointmentEntitySaga.watch(),
    
    // videoEntitySaga.watch(),
    // authEntitySaga.watch(),
    // reviewEntitySaga.watch(),
    // actorEntitySaga.watch(),
    // actorRoleEntitySaga.watch(),
    // userEntitySaga.watch(),
  ]);
}
