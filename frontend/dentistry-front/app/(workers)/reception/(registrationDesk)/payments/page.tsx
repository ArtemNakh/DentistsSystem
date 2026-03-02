"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IAppointmentActions } from "@/lib/redux/modules/AppointmentsActions/AppointmentActions.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";

export const DenormalizePayments = createSelector(
  [
    //Кожен селектор повертає відповідний шматок стану Redux:
    (state: RootState) => state.payments,
    (state: RootState) => state.appointments,
    (state: RootState) => state.clients,
    (state: RootState) => state.workers,
    (state: RootState) => state.specialties,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.appointmentActions,
    (state: RootState) => state.operationList,
  ],
  (
    paymentsObj,
    appointmentsObj,
    clientsObj,
    workersObj,
    specialtiesObj,
    dentistriesObj,
    appointmentActionsObj,
    operationListsObj,
  ): IPayment[] => {
    //Тут кожен slice (який зберігається як { id: entity }) перетворюється у масив.
    const payments: IPayment[] = Object.values(paymentsObj ?? {});
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    const appointmentActions: IAppointmentActions[] = Object.values(
      appointmentActionsObj ?? {},
    );
    const operationLists: IOperationList[] = Object.values(
      operationListsObj ?? {},
    );

    return payments
      .map((payment) => {
        const appointment = appointments.find(
          (a) => a.id === (payment.appointment as any),
        );
        if (!appointment) return null; // якщо не знайдено — пропускаємо

        const client =
          clients.find((c) => c.id === (appointment.client as any)) ?? null;
        const worker =
          workers.find((w) => w.id === (appointment.dentist as any)) ?? null;
        const specialty = worker
          ? (specialties.find((s) => s.id === (worker.specialty as any)) ??
            null)
          : null;
        const dentistry = worker
          ? (dentistries.find((d) => d.id === (worker.dentistry as any)) ??
            null)
          : null;

        const actions = appointment.appointment_actions
          ?.map((actionId) => {
            const action = appointmentActions.find(
              (aa) => aa.id === (actionId as any),
            );
            if (!action) return null;
            const operation =
              operationLists.find(
                (op) => op.id === (action.operation as any),
              ) ?? null;
            return { ...action, operation };
          })
          .filter(Boolean) as IAppointmentActions[] | undefined;

        return {
          ...payment,
          appointment: {
            ...appointment,
            client,
            dentist: worker,
            specialty,
            dentistry,
            appointment_actions: actions,
          },
        };
      })
      .filter(Boolean) as IPayment[];
  },
);

export default function PaymentReception() {
  const dispatch = useAppDispatch();
  const [fullInfo, setFullInfo] = useState<IAppointment | null>(null);

  const payments = useAppSelector(DenormalizePayments);

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  useEffect(() => {
    console.log("payments", payments);
  }, [payments]);

  useEffect(() => {
    if (!authUser.user) return;

    dispatch(getPaymentsDentistry({ dentistryId: authUser.user.dentistry.id }));
  }, [authUser.user?.dentistry?.id, dispatch]);

  return (
    <>
      <div>
        {/* filtres */}
        <div></div>

        {/* content */}
        <div>
          <table className="min-w-full border-collapse border border-gray-600 text-base">
            <thead>
              <tr className="border-gray-400">
                <th className="border  px-4 py-2 text-center">Client</th>
                <th className="border  px-4 py-2 text-center">Worker</th>
                <th className="border  px-4 py-2 text-center">Amount</th>
                <th className="border  px-4 py-2 text-center">Status</th>
                <th className="border  px-4 py-2 text-center">Method</th>
                <th className="border  px-4 py-2 text-center">Payment Date</th>
                <th className="border  px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-300 bg-gray-200 text-gray-700 "
                >
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {p.appointment.client?.surname} {p.appointment.client?.name}{" "}
                    {p.appointment.client?.middle_name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {p.appointment.dentist?.surname}{" "}
                    {p.appointment.dentist?.name}{" "}
                    {p.appointment.dentist?.middle_name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {p.amount}
                  </td>

                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {p.status_paid}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {p.method_pay}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {new Date(p.payment_date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    <button
                      onClick={() => setFullInfo(p.appointment)}
                      className="  text-gray-500 hover:underline"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {fullInfo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30">
              <div className="bg-gray-200 text-base  text-gray-700 rounded-lg shadow-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-auto">
                <h2 className=" font-semibold mb-4">
                  Appointment actions
                </h2>

                <p>{fullInfo.notes}</p>

                {fullInfo.appointment_actions?.map((action, index) => (
                  <div
                    key={index}
                    className="text-gray-600 border border-gray-400 my-1 px-2 py-2"
                  >
                    <p className=" text-base"> Action : {index}</p>
                    <p>Name: {action.operation.name}</p>
                    <p>Description: {action.operation.description}</p>
                    <p>Price:{action.operation.price}</p>
                  </div>
                ))}

                <button
                  onClick={() => setFullInfo(null)}
                  className="mt-4 px-4 py-2 bg-[#816EB5] text-white rounded hover:bg-[#7463A3]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
