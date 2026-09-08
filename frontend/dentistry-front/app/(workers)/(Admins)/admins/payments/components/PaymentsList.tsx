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
import { useEffect, useState } from "react";
import { PaymentFilters } from "./FilterPanel";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useTranslation } from "react-i18next";

function getFilteredPayments(payments: IPayment[], filters: PaymentFilters) {
  return payments.filter((p) => {
    const fioMatch =
  !filters.fio_worker ||
  `${p.appointment?.dentist?.surname ?? ""} ${p.appointment?.dentist?.name ?? ""} ${p.appointment?.dentist?.middle_name ?? ""}`
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
  const { t } = useTranslation();
  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const payments: IPayment[] = Object.values(
    UseDenormalizeSelector<IPayment[]>((state: RootState) => state.payments),
  ).filter(
    (payments) =>
      payments.appointment?.dentist?.dentistry?.id === authUser?.dentistry?.id,
  );

  const [skipPayments, setSkipPayments] = useState(0);
  const takePayments = 100;

  const filteredPayments: IPayment[] = getFilteredPayments(payments, filters);

  useEffect(() => {
    if (!authUser) return;

    dispatch(
      getPaymentsDentistry({
        dentistryId: authUser.dentistry.id,
        take: takePayments,
        skip: skipPayments,
      }),
    );
  }, [authUser?.dentistry?.id, skipPayments, dispatch]);

  return (
    <>
      <div>
        <TablePayments payments={filteredPayments} />
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setSkipPayments((prev) => prev + takePayments)}
          className="px-4 py-2 mb-5 border border-gray-700 bg-[#6f3aaf] text-white rounded scale-100  hover:scale-105 hover:bg-[#7946b7] transition"
        >
          {t("admins.load_more")}
        </button>
      </div>
    </>
  );
}
