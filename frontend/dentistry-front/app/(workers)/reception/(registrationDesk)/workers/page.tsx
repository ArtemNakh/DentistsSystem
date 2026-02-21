// показ усіх працівників ,фіо ,кнопка часи роботи яка
// перенаправляє користувача на сторінку календаря але
//  із фільтром працівника і показує тільки його розклад
"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  WorkerActions,
  WorkerActionSaga,
} from "@/lib/redux/modules/Workers/Workers.Entity";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";

export default function WorkerReception() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
const [filters, setFilters] = useState({ fio: "", specialty: "", birthday: "", });



  useEffect(() => {
    const GetDoctorsDentist: WorkerActions = {
      type: WorkerActionSaga.GetWorkersDentistry,
      payload: { idDentistry: 2 },
    };

    dispatch(GetDoctorsDentist);
  });

  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}
        <FilterPanelWorkers filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <ListWorkersWorker  filters={filters}/>
      </div>
    </>
  );
}
