import TablePayments from "./TablePayments/TablePayments";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { PaymentFilters } from "./FilterPanel";

function getFilteredPayments(payments: IPayment[], filters: PaymentFilters) {
  return payments.filter((p) => {
    const fioMatch =
      !filters.fio_worker ||
      `${p.appointment.dentist?.surname ?? ""} ${p.appointment.dentist?.name ?? ""} ${p.appointment.dentist?.middle_name ?? ""}`
        .toLowerCase()
        .includes(filters.fio_worker.toLowerCase());
    const amountMatch = !filters.amount || p.amount === filters.amount;
    const statusPaidMatch =
      !filters.status_paid || p.status_paid === filters.status_paid;
    const methodPayMatch =
      !filters.method_pay || p.method_pay === filters.method_pay;
    const statusAppointmentMatch =
      !filters.status_appointment ||
      p.appointment.status === filters.status_appointment;
    const dateBeginMatch =
      !filters.date_begin ||
      new Date(p.payment_date) >= new Date(filters.date_begin);
    const dateEndMatch =
      !filters.date_end ||
      new Date(p.payment_date) <= new Date(filters.date_end);
    return (
      fioMatch &&
      amountMatch &&
      statusPaidMatch &&
      methodPayMatch &&
      statusAppointmentMatch &&
      dateBeginMatch &&
      dateEndMatch
    );
  });
}

interface PaymentsListProps {
  filters: PaymentFilters;
}

export default function PaymentsList({ filters }: PaymentsListProps) {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const payments: IPayment[] = Object.values(
    UseDenormalizeSelector<IPayment[]>((state: RootState) => state.payments),
  ).filter(
    (payments) =>
      payments.appointment.dentist?.dentistry.id ===
      authUser.user?.dentistry.id,
  );

  useEffect(() => {
    if (!authUser.user) return;

    dispatch(getPaymentsDentistry({ dentistryId: authUser.user.dentistry.id }));
  }, [authUser.user?.dentistry?.id, dispatch]);

  const filteredPayments = getFilteredPayments(payments, filters);

  return (
    <>
      <div>
        <TablePayments payments={filteredPayments} />
      </div>
    </>
  );
}
