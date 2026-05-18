import { HistoryFilters } from "./FilterPanel";
import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { format } from "date-fns";
import TableHistoryAppointments from "./TableHistoryAppointments/TableHistoryAppointments";
import { useTranslation } from "react-i18next";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { RootState } from "@/lib/redux/store";

interface HistoryAppointmentsWorkerProps {
  filters: HistoryFilters;
}

export default function HistoryAppointmentsWorker({
  filters,
}: HistoryAppointmentsWorkerProps) {
  const { t } = useTranslation();

  const appointments = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  );
  
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
        <div className="mx-4 text-base overflow-scroll">
          <TableHistoryAppointments appointments={filteredAppointments} />
        </div>
      </div>
    </>
  );
}
