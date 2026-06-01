import { HistoryFilters } from "./FilterPanel";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { format } from "date-fns";
import TableHistoryAppointments from "./TableHistoryAppointments/TableHistoryAppointments";
import { useTranslation } from "react-i18next";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { GetAppointmentsByWorker } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorker/GetAppointmentsByWorker";
import { useEffect, useState } from "react";

interface HistoryAppointmentsWorkerProps {
  filters: HistoryFilters;
}

export default function HistoryAppointmentsWorker({
  filters,
}: HistoryAppointmentsWorkerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser: AuthState = UseDenormalizeSelector(
    (state: { auth: AuthState }) => state.auth,
  );

  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: { appointments: AuthState }) => state.appointments,
    ).filter((appointment) => appointment.dentist?.id === authUser.user?.id),
  );

  const [skip, setSkip] = useState(0);
  const take = 100;

  // отримання історії усіх прийомів для авторизованого працівника
  useEffect(() => {
    if (!authUser.user) return;
    dispatch(
      GetAppointmentsByWorker({
        workerId: authUser.user.id,
        skip: skip,
        take: take,
      }),
    );
  }, [authUser, skip]);

  const filteredAppointments = appointments.filter((ap) => {
    // фільтрування по ФІО клієнта
    const fioClientMatch =
      !filters.fioClient ||
      `${ap.client?.name} ${ap.client?.surname} ${ap.client?.middle_name}`
        .toLowerCase()
        .includes(filters.fioClient.toLowerCase());

    // фільтрування по статусу оплати
    const statusPaidMatch =
      !filters.status_paid || ap.payment?.status_paid === filters.status_paid;

    // фільтрування по даті (різні форми записи)
    const formattedDate = format(new Date(ap.appointment_date), "dd.MM.yyyy");
    const filter = filters.appointment_date?.trim() || "";

    let appointmentDateMatch = true;

    if (filter) {
      const parts = filter.split(".");

      if (parts.length === 1 && parts[0].length === 2) {
        // тільки день (dd)
        appointmentDateMatch = formattedDate.startsWith(parts[0]);
      } else if (
        parts.length === 2 &&
        parts[0].length === 2 &&
        parts[1].length === 2
      ) {
        // день + місяць (dd.MM)
        appointmentDateMatch = formattedDate.startsWith(
          `${parts[0]}.${parts[1]}`,
        );
      } else if (
        parts.length === 3 &&
        parts[0].length === 2 &&
        parts[1].length === 2 &&
        parts[2].length === 4
      ) {
        // повна дата (dd.MM.yyyy)
        appointmentDateMatch =
          formattedDate === `${parts[0]}.${parts[1]}.${parts[2]}`;
      } else if (
        parts.length === 2 &&
        parts[0] === "" &&
        parts[1].length === 2
      ) {
        // тільки місяць (.MM)
        appointmentDateMatch = formattedDate.slice(3, 5) === parts[1];
      } else if (
        parts.length === 3 &&
        parts[0] === "" &&
        parts[1] === "" &&
        parts[2].length === 4
      ) {
        // тільки рік (..YYYY)
        appointmentDateMatch = formattedDate.slice(6, 10) === parts[2];
      } else if (
        parts.length === 3 &&
        parts[0] === "" &&
        parts[1].length === 2 &&
        parts[2].length === 4
      ) {
        // місяць + рік (.MM.YYYY)
        appointmentDateMatch =
          formattedDate.slice(3, 5) === parts[1] &&
          formattedDate.slice(6, 10) === parts[2];
      } else {
        appointmentDateMatch = false; // некоректний формат
      }
    }

    return fioClientMatch && statusPaidMatch && appointmentDateMatch;
  });

  return (
    <>
      <div className="w-full  ">
        <div className="mx-4 text-base">
          <TableHistoryAppointments appointments={filteredAppointments} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setSkip((prev) => prev + take)}
            className="px-4 py-2 my-2 mb-5 border  border-gray-700 bg-[#6f3aaf] text-white rounded scale-100  hover:scale-105 hover:bg-[#7946b7] transition"
          >
            {t("doctor.load_more")}
          </button>
        </div>
      </div>
    </>
  );
}
