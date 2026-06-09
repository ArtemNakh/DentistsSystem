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
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { GetAppointmentsByWorker } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorker/GetAppointmentsByWorker";
import { useTranslation } from "react-i18next";
import i18n from "@/i18next.config";

export default function CalendarAdmin() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  )
    .filter((appointment) => appointment.dentist?.id === authUser.user?.id)
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  //отримання авторизованого користувача
  useEffect(() => {
    console.log("Auth effect triggered", authUser.user);
    if (!authUser.user) {
      dispatch(getAuthWorker({}));
    }
  }, [dispatch, authUser.user]);

  //отримання appointments для доктора
  useEffect(() => {
    const workerId = authUser.user?.id;
    console.log("Appointments effect triggered", workerId);
    if (workerId) {
      dispatch(GetAppointmentsByWorker({ workerId: workerId }));
    }
  }, [dispatch, authUser.user?.id]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [value, setValue] = useState<Date>(new Date());
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setShowSidebar(false);
    };
    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const sidebarContent = (
    <AllDayRecords appointments={appointments} selectedDate={value} />
  );
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
            locale={i18n.language}
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
        {/* Sidebar для великих екранів */}
        <div className="hidden md:block  border-l border-gray-300">
          {sidebarContent}
        </div>
        {/* Overlay sidebar для мобільних */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-end z-50 md:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className=" bg-linear-to-r from-[#874FD1] to-[#7562A5] h-full shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </div>
          </div>
        )}
        {/* Триггер для мобільних */}
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed bottom-4 right-4 md:hidden bg-[#8C56D6] text-white px-4 py-2 rounded shadow-lg border-2 border-gray-450"
        >
          {t("doctor.calendar.appointments_adaptive_view")}
        </button>
      </div>
    </>
  );
}
