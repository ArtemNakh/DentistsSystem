"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getHistoryAppointmentByDentistry } from "@/lib/redux/modules/Appointments/actions/GetHistoryAppointmentDentistry/GetHistoryAppointmentDentistry";
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
      console.log("Un authorized worker");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  // отримання історії усіх прийомів для авторизованого працівника
  useEffect(() => {
    if (!authUser.user) return;
    dispatch(
      getHistoryAppointmentByDentistry({
        dentistryId: authUser.user.dentistry.id,
      }),
    );
  }, [authUser]);

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
