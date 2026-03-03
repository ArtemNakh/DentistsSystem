"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Specialties.interface";
import RenderCalendarTile from "./components/renderCalendarTile";
import AllDayRecords from "./components/AllDayRecords";
import { getAppointmentDentistry } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsDentistry/GetAppointmentsDentistry";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";

export const DenormalizeAppointments = createSelector(
  [
    (state: RootState) => state.appointments,
    (state: RootState) => state.workers,
    (state: RootState) => state.clients,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.specialties,
  ],
  (appointmentsObj, workersObj, clientsObj, dentistriesObj, specialtiesObj) => {
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
    return appointments.map((a) => {
      const worker = workers.find((w) => w.id === (a.dentist as any)) ?? null;
      const client = clients.find((c) => c.id === (a.client as any)) ?? null;
      const dentistry =
        dentistries.find((d) => d.id === (worker?.dentistry as any)) ?? null;
      const specialty =
        specialties.find((s) => s.id === (worker?.specialty as any)) ?? null;
      return { ...a, dentist: worker, client, dentistry, specialty };
    });
  },
);

export default function CalendarAdmin() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const appointments = useAppSelector(DenormalizeAppointments);
  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) {
      console.log("check user ");
      return;
    }

    dispatch(
      getAppointmentDentistry({ dentistryId: authUser.user.dentistry.id }),
    );
  }, [dispatch, authUser.user]);

  const [value, setValue] = useState<Date>(new Date());

  return (
    <>
      <div className=" flex  min-h-screen ">
        {/* lefft side */}
        {/* calendar */}
        {/* <div className="flex-1 h-full flex flex-col"> */} {/* календар */}
        <div className="flex-1 min-h-full flex flex-col items-center justify-center text-base">
          <Calendar
            value={value}
            onChange={(val) => setValue(val as Date)}
            tileContent={({ date, view }) => (
              <RenderCalendarTile
                date={date}
                view={view}
                appointments={appointments}
              />
            )}
            tileClassName={({ date, view }) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return `relative h-30 border ${isToday ? "border-yellow-500" : "border-gray-300"} bg-linear-to-r from-[#7F59BD] to-[#795EAF] text-base`;
            }}
            className="calendar-admin bg-linear-to-l from-[#874FD1] to-[#6F6697] w-full h-full text-base  "
            minDetail="month"
            maxDetail="month"
          />
        </div>
        {/* Right part */}
        <div className="h-full">
          <AllDayRecords appointments={appointments} selectedDate={value} />
        </div>
      </div>
    </>
  );
}
