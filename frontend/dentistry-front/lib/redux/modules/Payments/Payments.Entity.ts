import { call, takeLatest } from "redux-saga/effects";
import { ActionReducer } from "../../rootReducer";
import BaseEntity, { EntitiesRedux } from "../BaseEntity";
import { EntityReducer } from "../EntityReducer";
import { schema } from "normalizr";

export enum PaymentActionSaga {
  GetPaiments = "Payment/Get",
}
interface GetPaymentsPayload {
  id: number;
}
@EntityReducer(EntitiesRedux.Payments)
export class PaymentEntity extends BaseEntity {
  constructor(ctx: any) {
    super(ctx, EntitiesRedux.Payments, {
      appointment: new schema.Entity(EntitiesRedux.Appointments, {
        client: new schema.Entity(EntitiesRedux.Clients),
        dentist: new schema.Entity(EntitiesRedux.Workers),
      }),
    });
  }

  *getPaymentsSaga(action: { type: string; payload: GetPaymentsPayload }) {
    const { id } = action.payload;
    yield call(
      this.xRead.bind(this),
      `/payment/all?dentist=${id}`,
      ActionReducer.Get,
    );
  }

  *watch() {
    yield takeLatest(
      PaymentActionSaga.GetPaiments,
      this.getPaymentsSaga.bind(this),
    );
  }
}
