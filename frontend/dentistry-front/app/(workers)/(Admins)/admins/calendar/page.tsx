"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import RenderCalendarTile from "./components/renderCalendarTile";
import AllDayRecords from "./components/AllDayRecords";
import { getAppointmentDentistry } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsDentistry/GetAppointmentsDentistry";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import i18n from "@/i18next.config";

export default function CalendarAdmin() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const appointments = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  );

  useEffect(() => {
    console.log("Auth effect triggered", authUser.user);
    if (!authUser.user) {
      dispatch(getAuthWorker({}));
    }
  }, [dispatch, authUser.user]);

  useEffect(() => {
    const dentistryId = authUser.user?.dentistry?.id;
    console.log("Appointments effect triggered", dentistryId);
    if (dentistryId) {
      dispatch(getAppointmentDentistry({ dentistryId }));
    }
  }, [dispatch, authUser.user?.dentistry?.id]);

  const [value, setValue] = useState<Date>(new Date());

  return (
    <>
      <div className=" flex  min-h-screen ">
        {/* lefft side */}
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
            tileClassName={({ date }) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return `relative h-30 border ${isToday ? "border-yellow-500" : "border-gray-300"} bg-linear-to-r from-[#7F59BD] to-[#795EAF] text-base`;
            }}
            className="calendar-admin bg-linear-to-l from-[#874FD1] to-[#6F6697] w-full h-full text-base  "
            minDetail="month"
            maxDetail="month"
            locale={i18n.language}
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
