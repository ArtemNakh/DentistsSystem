// показ усіх працівників ,фіо ,кнопка часи роботи яка
// перенаправляє користувача на сторінку календаря але
//  із фільтром працівника і показує тільки його розклад
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  
  WorkerActionSaga,
} from "@/lib/redux/modules/Workers/Workers.Entity";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";

import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";

export default function WorkerReception({
  // workersDoctors,
}: {
  // workersDoctors: IWorker[];
}) {
  
  // const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState({
    fio: "",
    specialty: "",
    birthday: "",
  });

  // useEffect(() => {
  //   console.log("work")
  //   // dispatch(saveWorkersToRedux({workers:workersDoctors}));
  //   dispatch(getWorkersDentistry({idDentistry:authUser.user?.dentistry.id!}))
  //   console.log("wor12k")
    
  // }, [ dispatch]);

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
