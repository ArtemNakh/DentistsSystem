"use client";
import { useState } from "react";
import FilterPanelHistory, { HistoryFilters } from "./components/FilterPanel";
import HistoryAppointmentsWorker from "./components/HistoryAppointments";

export default function HistoryOperationReception() {
  const [filters, setFilters] = useState<HistoryFilters>({
    fioClient: "",
    fioWorker: "",
    specialty: "",
    statusPaid: null,
    appointment_date: "",
  });

  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}

        <FilterPanelHistory filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <HistoryAppointmentsWorker filters={filters} />
      </div>
    </>
  );
}
