// показ усіх працівників ,фіо ,кнопка часи роботи яка
// перенаправляє користувача на сторінку календаря але
//  із фільтром працівника і показує тільки його розклад
"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  
  WorkerActionSaga,
} from "@/lib/redux/modules/Workers/Workers.Entity";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export default function WorkerReception({
  workersDoctors,
}: {
  workersDoctors: IWorker[];
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState({
    fio: "",
    specialty: "",
    birthday: "",
  });

  useEffect(() => {
    dispatch({
      type: WorkerActionSaga.SaveWorkers,
      payload: workersDoctors,
    });
  }, [workersDoctors, dispatch]);

  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}
        <FilterPanelWorkers filters={filters} setFilters={setFilters} />

        {/* Список працівників */}
        <ListWorkersWorker filters={filters} />
      </div>
    </>
  );
}
