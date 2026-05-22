"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useEffect, useState } from "react";
import FilterPanelHistory from "./components/FilterPanel";
import HistoryAppointmentsClient from "./components/HistoryAppointments";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { GetAppointmentsToClient } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByClient/GetAppointmentsByClient";

export default function HistoryOperationsClient() {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [filters, setFilters] = useState({
    fioClient: "",
    fioWorker: "",
    specialty: "",
    statusPaid: "",
    appointment_date: "",
  });

  useEffect(() => {
    if (authUser.user) {
      console.log("Un authorized client");
      return;
    }
    dispatch(getAuthClient({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;

    //отримання усі  appointment які були плоть до сьогодні
    dispatch(GetAppointmentsToClient({ clientId: authUser.user.id }));
  }, [authUser]);

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
