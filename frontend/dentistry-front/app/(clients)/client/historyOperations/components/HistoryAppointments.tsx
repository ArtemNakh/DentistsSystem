import { HistoryFilters } from "./FilterPanel";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { format } from "date-fns";
import TableHistoryAppointments from "./TableHistoryAppointments";
import { useTranslation } from "react-i18next";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { GetAppointmentsToClient } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByClient/GetAppointmentsByClient";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";

interface HistoryAppointmentsClientProps {
  filters: HistoryFilters;
}

export default function HistoryAppointmentsClient({
  filters,
}: HistoryAppointmentsClientProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ) ?? {},
  );

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [skip, setSkip] = useState(0);
  const take = 10;
  // перший запит
  useEffect(() => {
    if (appointments.length === 0) {
      if (!authUser?.user?.id) return;
      dispatch(
        GetAppointmentsToClient({ clientId: authUser?.user?.id, take, skip }),
      ); // clientId бери з authUser
    }
  }, [authUser]);

  const onLoadMore = () => {
    if (!authUser?.user?.id) return;
    const newSkip = skip + take;
    setSkip(newSkip);
    dispatch(
      GetAppointmentsToClient({
        clientId: authUser.user.id,
        take,
        skip: newSkip,
      }),
    );
  };

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
  !filters.statusPaid || ap.payment?.status_paid === filters.statusPaid;

        // const statusPaidMatch =
    //   !filters.statusPaid ||
    //   `${ap.payment?.status_paid}`
    //     .toLowerCase()
    //     .includes(filters.statusPaid.toLowerCase());
    const specialtyMatch =
      !filters.specialty ||
      ap.dentist?.specialty?.name
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
        <div className="mx-4 text-base">
          <TableHistoryAppointments
            appointments={filteredAppointments}
            onLoadMore={onLoadMore}
          />
        </div>
      </div>
    </>
  );
}
