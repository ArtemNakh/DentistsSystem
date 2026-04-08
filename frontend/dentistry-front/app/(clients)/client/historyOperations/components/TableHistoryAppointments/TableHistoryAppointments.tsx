"use client"
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import TableHeaderHistoryAppointment from "./TableHeader";
import TableBodyHistoryAppointment from "./TableBody";
import { useState } from "react";
import ShowAppointmentActions from "../ModalView/ShowAppointmentActions";
import { useTranslation } from "react-i18next";

interface TableHistoryAppointmentsProps{

  appointments: IAppointment[];
}

export default function TableHistoryAppointments({
  appointments,
}: TableHistoryAppointmentsProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  return (
    <>
      <table className="w-full   border-collapse border border-gray-600 text-lg">
        <TableHeaderHistoryAppointment />


          <TableBodyHistoryAppointment
            appointments={appointments}
            setSelectedAppointment={setSelectedAppointment}
          />
      
      
      </table>

      <ShowAppointmentActions
        appointment={selectedAppointment}
        setAppointment={setSelectedAppointment}
      />
    </>
  );
}
