import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { schema } from "normalizr";
import { AllPaymentsDentistAction } from "./actions/getAllPaymentsDentist/getAllPaymentsByDoctor";
import { PaymentsDentistryAction } from "./actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";

export enum PaymentActionSaga {
  GetAllPaimentsDentist = "Payment/Get",
  GetPaymentsDentistry = "Payment/GetByDentistry",
}


// export const PaymentSchema = new schema.Entity(
//   EntitiesRedux.Payments, {
//       appointment: new schema.Entity(EntitiesRedux.Appointments, {
//         client: new schema.Entity(EntitiesRedux.Clients),
//         dentist: new schema.Entity(EntitiesRedux.Workers),
//         appointment_actions: [
//           new schema.Entity(EntitiesRedux.AppointmentActions, {
//             operation: new schema.Entity(EntitiesRedux.OperationList, {
//               dental_clinics: new schema.Entity(EntitiesRedux.Dentistries),
//             }),
//           }),
//         ],
//       }),}
// );

@EntityReducer(EntitiesRedux.Payments)
export class PaymentEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Payments, {
      appointment: new schema.Entity(EntitiesRedux.Appointments, {
        client: new schema.Entity(EntitiesRedux.Clients),
        dentist: new schema.Entity(EntitiesRedux.Workers),
        appointment_actions: [
          new schema.Entity(EntitiesRedux.AppointmentActions, {
            operation: new schema.Entity(EntitiesRedux.OperationList, {
              dental_clinics: new schema.Entity(EntitiesRedux.Dentistries),
            }),
          }),
        ],
      }),
    });
  }
  // Статичне поля для отримання схеми
  static schema = new PaymentEntity(null).getSchema();

  *getAllPaymentsDentistSaga(action: AllPaymentsDentistAction) {
    const { dentistId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/payment/all?dentist=${dentistId}`,
      ActionReducer.Get,
    );
  }

  *getPaymentsDentistrySaga(action: PaymentsDentistryAction) {
    const { dentistryId } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/payment/allByDentistry?dentistry=${dentistryId}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      PaymentActionSaga.GetAllPaimentsDentist,
      this.getAllPaymentsDentistSaga.bind(this),
    );
    yield takeLatest(
      PaymentActionSaga.GetPaymentsDentistry,
      this.getPaymentsDentistrySaga.bind(this),
    );
  }
}
