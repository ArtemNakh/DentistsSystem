import clientContainer from "../di/container";
import { all } from "redux-saga/effects";

export function* rootSaga() {
  const clientEntitySaga = clientContainer.resolve("ClientEntity");
  const dentistryEntitySaga = clientContainer.resolve("DentistryEntity");
  const workerEntitySaga = clientContainer.resolve("WorkerEntity");
  const specialtyEntitySaga = clientContainer.resolve("SpecialtyEntity");
  const appointmentEntitySaga = clientContainer.resolve("AppointmentEntity");
  const paymentEntitySaga = clientContainer.resolve("PaymentEntity");
  const authEntitySaga = clientContainer.resolve("AuthEntity");
  const appointmentActionsEntitySaga = clientContainer.resolve(
    "AppointmentActionsEntity",
  );

  const operationListEntitySaga = clientContainer.resolve(
    "OperationListEntity",
  );

  const findingWorkersEntitySaga = clientContainer.resolve(
    "FindingWorkersEntity",
  );
  const workerShifts = clientContainer.resolve("WorkerShiftsEntity");
  yield all([
    clientEntitySaga.watch(),
    dentistryEntitySaga.watch(),
    workerEntitySaga.watch(),
    specialtyEntitySaga.watch(),
    appointmentEntitySaga.watch(),
    paymentEntitySaga.watch(),
    authEntitySaga.watch(),
    appointmentActionsEntitySaga.watch(),
    operationListEntitySaga.watch(),
    findingWorkersEntitySaga.watch(),
    workerShifts.watch(),
  ]);
}
