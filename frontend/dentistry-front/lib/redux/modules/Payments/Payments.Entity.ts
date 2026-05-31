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
      `/payment/allByWorker?dentistId=${dentistId}`,
      ActionReducer.Get,
    );
  }

  *getPaymentsDentistrySaga(action: PaymentsDentistryAction) {
    const { dentistryId, take, skip } = action.payload;

    // базовий URL
    let url = `/payment/allByDentistry?dentistryId=${dentistryId}`;

    // додаємо параметри тільки якщо вони є
    if (typeof take !== "undefined") {
      url += `&take=${take}`;
    }
    if (typeof skip !== "undefined") {
      url += `&skip=${skip}`;
    }

    yield call(this.xRead.bind(this), url, ActionReducer.Get);
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
