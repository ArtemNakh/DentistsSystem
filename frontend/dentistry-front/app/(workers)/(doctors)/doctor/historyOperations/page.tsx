"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useEffect, useState } from "react";
import FilterPanelHistory, { HistoryFilters } from "./components/FilterPanel";
import HistoryAppointmentsWorker from "./components/HistoryAppointments";

export default function HistoryOperationReception() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [filters, setFilters] = useState<HistoryFilters>({
    fioClient: "",
    status_paid: null,
    appointment_date: "",
  });

  // отримання данихз авторизованого користувача
  useEffect(() => {
    if (authUser.user) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);


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
