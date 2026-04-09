"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import FilterPanelHistory from "./components/FilterPanel";
import HistoryAppointmentsClient from "./components/HistoryAppointments";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { GetAppointmentsToClient } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByClient/GetAppointmentsByClient";


export const DenormalizeAppointments = createSelector(
  [
    (state: RootState) => state.appointments,
    (state: RootState) => state.clients,
    (state: RootState) => state.workers,
    (state: RootState) => state.specialties,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.appointmentActions,
    (state: RootState) => state.operationList,
    (state: RootState) => state.payments,
  ],
  (
    appointmentsObj,
    clientsObj,
    workersObj,
    specialtiesObj,
    dentistriesObj,
    appointmentActionsObj,
    operationListObj,
    paymentsObj,
  ) => {
    if (!appointmentsObj) return [];

    return Object.values(appointmentsObj).map((a) => {
      if (!a) return undefined;

      // client
      const client = clientsObj?.[a.client as unknown as number];

      // dentist
      const dentist = workersObj?.[a.dentist as unknown as number];

      const specialty =
        dentist?.specialty !== undefined
          ? specialtiesObj?.[dentist.specialty as unknown as number]
          : undefined;

      const dentistry =
        dentist?.dentistry !== undefined
          ? dentistriesObj?.[dentist.dentistry as unknown as number]
          : undefined;

      // appointment_actions
      const appointmentActions =
        a.appointment_actions?.map((actionId: number) => {
          const action = appointmentActionsObj?.[actionId];
          if (!action) return undefined;

          const operation =
            action.operation !== undefined
              ? operationListObj?.[action.operation as unknown as number]
              : undefined;

          const dentalClinic =
            operation?.dental_clinic !== undefined
              ? dentistriesObj?.[
                  operation.dental_clinic as unknown as number
                ]
              : undefined;

          return {
            ...action,
            operation: operation
              ? {
                  ...operation,
                  dental_clinic: dentalClinic,
                }
              : undefined,
          };
        })?.filter(Boolean);

      // payment
      const payment =
        a.payment !== undefined
          ? paymentsObj?.[a.payment as unknown as number]
          : undefined;

      return {
        ...a,
        client,
        dentist: dentist
          ? {
              ...dentist,
              specialty,
              dentistry,
            }
          : undefined,
        appointment_actions: appointmentActions,
        payment,
      } as IAppointment;
    }).filter(Boolean); // прибираємо undefined якщо були
  },
);
// export const DenormalizeAppointments = createSelector(

//   [
//     (state: RootState) => state.appointments,
//     (state: RootState) => state.workers,
//     (state: RootState) => state.clients,
//     (state: RootState) => state.dentistries,
//     (state: RootState) => state.specialties,
//     (state: RootState) => state.appointment_actions,
//     (state: RootState) => state.operation_lists,
//     (state: RootState) => state.payments,
//   ],
//   (
//     appointmentsObj,
//     workersObj,
//     clientsObj,
//     dentistriesObj,
//     specialtiesObj,
//     appointmentActionsObj,
//     operationListsObj,
//     paymentsObj,
//   ): IAppointment[] => {
//     const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
//     const workers: IWorker[] = Object.values(workersObj ?? {});
//     const clients: IClient[] = Object.values(clientsObj ?? {});
//     const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
//     const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
//     const appointmentActions: IAppointmentActions[] = Object.values(
//       appointmentActionsObj ?? {},
//     );
//     const operations: IOperationList[] = Object.values(operationListsObj ?? {});
//     const payments: IPayment[] = Object.values(paymentsObj ?? {});

//     return appointments.map((appointment) => {
//       const worker =
//         workers.find((w) => w.id === (appointment.dentist as any)) ?? null;
//       const client =
//         clients.find((c) => c.id === (appointment.client as any)) ?? null;
//       const dentistry =
//         dentistries.find((d) => d.id === (worker?.dentistry as any)) ?? null;
//       const specialty =
//         specialties.find((s) => s.id === (worker?.specialty as any)) ?? null;

//       const actionsForAppointment: IAppointmentActions[] = appointmentActions
//         .filter((aa) => (aa.appointment as any) === appointment.id)
//         .map((aa) => {
//           const operation = operations.find(
//             (op) => op.id === (aa.operation as any),
//           );
//           if (!operation) {
//             throw new Error(`Operation not found for action ${aa.id}`);
//           }
//           return {
//             ...aa,
//             appointment,
//             operation,
//             dentist: worker,
//             client,
//             dentistry,
//             specialty,
//           };
//         });

//       const payment =
//         payments.find((p) => p.id === (appointment.payment as any)) ??
//         undefined;

//       return {
//         ...appointment,
//         dentist: worker,
//         client,
//         dentistry,
//         specialty,
//         appointment_actions: actionsForAppointment,
//         payment,
//       };
//     });
//   },
// );

export default function HistoryOperationsClient() {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [filters, setFilters] = useState({
    fioClient: "",
    fioWorker: "",
    specialty: "",
    statusPaid: "",
    appointment_date: "",
  });

  useEffect(() => {
    if (authUser.user) {
      console.log("Un authorized client");
      return;
    }
    dispatch(getAuthClient({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;

    //отримання усі  appointment які були плоть до сьогодні
    dispatch(
      GetAppointmentsToClient({ clientId: authUser.user.id }),
      //   getHistoryAppointmentByDentistry({
      //     dentistryId: authUser.user.dentistry.id,
      //   }),
    );
  }, [authUser]);

  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}

        <FilterPanelHistory filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <HistoryAppointmentsClient filters={filters} />
      </div>
    </>
  );
}
