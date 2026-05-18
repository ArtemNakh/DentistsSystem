import TablePayments from "./TablePayments/TablePayments";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IAppointmentActions } from "@/lib/redux/modules/AppointmentsActions/AppointmentActions.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { PaymentFilters } from "./FilterPanel";

// export const DenormalizePayments = createSelector(
//   [
//     //Кожен селектор повертає відповідний шматок стану Redux:
//     (state: RootState) => state.payments,
//     (state: RootState) => state.appointments,
//     (state: RootState) => state.clients,
//     (state: RootState) => state.workers,
//     (state: RootState) => state.specialties,
//     (state: RootState) => state.dentistries,
//     (state: RootState) => state.appointmentActions,
//     (state: RootState) => state.operationList,
//   ],
//   (
//     paymentsObj,
//     appointmentsObj,
//     clientsObj,
//     workersObj,
//     specialtiesObj,
//     dentistriesObj,
//     appointmentActionsObj,
//     operationListsObj,
//   ): IPayment[] => {
//     //Тут кожен slice (який зберігається як { id: entity }) перетворюється у масив.
//     const payments: IPayment[] = Object.values(paymentsObj ?? {});
//     const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
//     const clients: IClient[] = Object.values(clientsObj ?? {});
//     const workers: IWorker[] = Object.values(workersObj ?? {});
//     const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
//     const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
//     const appointmentActions: IAppointmentActions[] = Object.values(
//       appointmentActionsObj ?? {},
//     );
//     const operationLists: IOperationList[] = Object.values(
//       operationListsObj ?? {},
//     );

//     return payments
//       .map((payment) => {
//         const appointment = appointments.find(
//           (a) => a.id === (payment.appointment as any),
//         );
//         if (!appointment) return null; // якщо не знайдено — пропускаємо

//         const client =
//           clients.find((c) => c.id === (appointment.client as any)) ?? null;
//         const worker =
//           workers.find((w) => w.id === (appointment.dentist as any)) ?? null;
//         const specialty = worker
//           ? (specialties.find((s) => s.id === (worker.specialty as any)) ??
//             null)
//           : null;
//         const dentistry = worker
//           ? (dentistries.find((d) => d.id === (worker.dentistry as any)) ??
//             null)
//           : null;

//         const actions = appointment.appointment_actions
//           ?.map((actionId) => {
//             const action = appointmentActions.find(
//               (aa) => aa.id === (actionId as any),
//             );
//             if (!action) return null;
//             const operation =
//               operationLists.find(
//                 (op) => op.id === (action.operation as any),
//               ) ?? null;
//             return { ...action, operation };
//           })
//           .filter(Boolean) as IAppointmentActions[] | undefined;

//         return {
//           ...payment,
//           appointment: {
//             ...appointment,
//             client,
//             dentist: worker,
//             specialty,
//             dentistry,
//             appointment_actions: actions,
//           },
//         };
//       })
//       .filter(Boolean) as IPayment[];
//   },
// );

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
  // const payments = useAppSelector(DenormalizePayments);
  const payments = Object.values(
    UseDenormalizeSelector<IPayment[]>((state: RootState) => state.payments),
  );
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  useEffect(() => {
    if (!authUser.user) return;

    dispatch(getPaymentsDentistry({ dentistryId: authUser.user.dentistry.id }));
  }, [authUser.user?.dentistry?.id, dispatch]);

  const filteredPayments = getFilteredPayments(payments, filters);

  return (
    <>
      <div className="mx-4 overflow-scroll">
        <TablePayments payments={filteredPayments} />
      </div>
    </>
  );
}
