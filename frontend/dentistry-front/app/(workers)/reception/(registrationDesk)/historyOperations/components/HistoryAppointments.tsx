import { useState } from "react";
import { HistoryFilters } from "./FilterPanel";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import { DenormalizeAppointments } from "../page";
import { format } from "date-fns";
import TableHistoryAppointments from "./TableHistoryAppointments/TableHistoryAppointments";

export default function HistoryAppointmentsWorker({
  filters,
}: {
  filters: HistoryFilters;
}) {
  const appointments = useAppSelector(DenormalizeAppointments);

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
        <div className="mx-4">
          {!appointments ? (
            <span className="text-gray-900">Loading...</span>
          ) : appointments.length > 0 ? (
            <TableHistoryAppointments appointments={filteredAppointments} />
            
          ) : (
            <span className="text-gray-900">Немає працівників</span>
          )}
        </div>
      </div>
    </>
  );
}
