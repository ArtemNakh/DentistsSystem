"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useEffect, useState } from "react";
import FilterPanelHistory from "./components/FilterPanel";
import HistoryAppointmentsClient from "./components/HistoryAppointments";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { GetAppointmentsToClient } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByClient/GetAppointmentsByClient";

export default function HistoryOperationsClient() {

  const [filters, setFilters] = useState({
    fioClient: "",
    fioWorker: "",
    specialty: "",
    statusPaid: "",
    appointment_date: "",
  });


  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}

        <FilterPanelHistory filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <HistoryAppointmentsClient filters={filters} />
      </div>
    </>
  );
}
