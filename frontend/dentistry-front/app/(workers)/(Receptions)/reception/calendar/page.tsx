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
import { useTranslation } from "react-i18next";
import i18n from "@/i18next.config";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export default function CalendarAdmin() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState<Date>(new Date());
  const [showSidebar, setShowSidebar] = useState(false);

  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  ).sort(
    (a, b) =>
      new Date(a.appointment_date).getTime() -
      new Date(b.appointment_date).getTime(),
  );

  // Отримуємо авторізованого користувача якщо немає
  useEffect(() => {
    if (!authUser) {
      dispatch(getAuthWorker({}));
    }
  }, [dispatch, authUser]);

  // Завантажуємо записи для стоматології
  useEffect(() => {
    const dentistryId = authUser?.dentistry?.id;
    if (dentistryId) {
      dispatch(getAppointmentDentistry({ dentistryId }));
    }
  }, [dispatch, authUser?.dentistry?.id]);

  /**
   * Використовуємо matchMedia для відслідковування ширини екрану.
   * Якщо екран >=768px (md breakpoint), сайдбар у мобільному режимі закривається.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setShowSidebar(false);
    };
    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Контент сайдбару (список записів на день)
  const sidebarContent = (
    <AllDayRecords appointments={appointments} selectedDate={value} />
  );

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
              return `relative h-30 border ${isToday ? "border-2 border-yellow-500" : "border-gray-300"} bg-linear-to-r from-[#7F59BD] to-[#795EAF] text-base`;
            }}
            className="calendar-admin bg-linear-to-l from-[#874FD1] to-[#6F6697] w-full h-full text-base  "
            minDetail="month"
            maxDetail="month"
            locale={i18n.language}
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
          {t("reception.calendar.appointments_adaptive_view")}
        </button>
      </div>
    </>
  );
}
