import { HistoryFilters } from "./FilterPanel";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { format } from "date-fns";
import TableHistoryAppointments from "./TableHistoryAppointments/TableHistoryAppointments";
import { useTranslation } from "react-i18next";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { RootState } from "@/lib/redux/store";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useEffect, useState } from "react";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { getHistoryAppointmentByDentistry } from "@/lib/redux/modules/Appointments/actions/GetHistoryAppointmentDentistry/GetHistoryAppointmentDentistry";

interface HistoryAppointmentsWorkerProps {
  filters: HistoryFilters;
}

export default function HistoryAppointmentsWorker({
  filters,
}: HistoryAppointmentsWorkerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  );

  const [skip, setSkip] = useState(0);
  const take = 100;

  useEffect(() => {
    if (authUser) {
      console.log("Un authorized worker");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) return;

    //отримання усі  appointment які були плоть до сьогодні
    dispatch(
      getHistoryAppointmentByDentistry({
        dentistryId: authUser.dentistry.id,
        take: take,
        skip: skip,
      }),
    );
  }, [authUser, skip]);

  const filteredAppointments = appointments.filter((ap) => {
    const fioClientMatch =
      !filters.fioClient ||
      `${ap.client?.name} ${ap.client?.surname} ${ap.client?.middle_name}`
        .toLowerCase()
        .includes(filters.fioClient.toLowerCase());
    const fioWorkerMatch =
      !filters.fioWorker ||
      `${ap.dentist?.name} ${ap.dentist?.surname} ${ap.dentist?.middle_name}`
        .toLowerCase()
        .includes(filters.fioWorker.toLowerCase());
    const statusPaidMatch =
      !filters.statusPaid ||
      `${ap.payment?.status_paid}`
        .toLowerCase()
        .includes(filters.statusPaid.toLowerCase());
    const specialtyMatch =
      !filters.specialty ||
      ap.dentist?.specialty.name
        .toLowerCase()
        .includes(filters.specialty.toLowerCase());
    const appointmentDateMatch =
      !filters.appointment_date ||
      format(new Date(ap.appointment_date), "dd.MM.yyyy") ===
        filters.appointment_date;
    return (
      fioClientMatch &&
      fioWorkerMatch &&
      statusPaidMatch &&
      specialtyMatch &&
      appointmentDateMatch
    );
  });

  return (
    <>
      <div className="w-full  ">
        <div className="mx-4 text-base overflow-x-auto">
          <TableHistoryAppointments appointments={filteredAppointments} />
        </div>
        <div className="flex justify-center">
          {" "}
          <button
            onClick={() => setSkip((prev) => prev + take)}
            className="px-4 py-2 my-2 mb-5 border  border-gray-700 bg-[#6f3aaf] text-white rounded scale-100  hover:scale-105 hover:bg-[#7946b7] transition"
          >
            {t("reception.load_more")}
          </button>
        </div>
      </div>
    </>
  );
}
