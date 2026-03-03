"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getHistoryAppointmentByDentistry } from "@/lib/redux/modules/Appointments/actions/GetHistoryAppointmentDentistry/GetHistoryAppointmentDentistry";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import FilterPanelHistory from "./components/FilterPanel";
import HistoryAppointmentsWorker from "./components/HistoryAppointments";

export const DenormalizeAppointments = createSelector(
  [
    (state: RootState) => state.appointments,
    (state: RootState) => state.workers,
    (state: RootState) => state.clients,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.specialties,
  ],
  (
    appointmentsObj,
    workersObj,
    clientsObj,
    dentistriesObj,
    specialtiesObj,
  ): IAppointment[] => {
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
    return appointments.map((appointment) => {
      const worker =
        workers.find((w) => w.id === (appointment.dentist as any)) ?? null;
      const client =
        clients.find((c) => c.id === (appointment.client as any)) ?? null;
      const dentistry =
        dentistries.find((d) => d.id === (worker?.dentistry as any)) ?? null;
      const specialty =
        specialties.find((s) => s.id === (worker?.specialty as any)) ?? null;
      return { ...appointment, dentist: worker, client, dentistry, specialty };
    });
  },
);

// сторінка яка показує усі операції для стоматології (із фільтром текущії, заплановані, зроблені,скасовано)
export default function HistoryOperationReception() {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector(DenormalizeAppointments);

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
      console.log("Un authorized worker");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;

    //отримання усі  appointment які були плоть до сьогодні
    dispatch(
      getHistoryAppointmentByDentistry({
        dentistryId: authUser.user.dentistry.id,
      }),
    );
  }, [authUser]);

  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}

        <FilterPanelHistory filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <HistoryAppointmentsWorker filters={filters} />
      </div>
    </>
  );
}
