"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";

export default function WorkerReception({}: {}) {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    fio: "",
    specialty: "",
    birthday: "",
  });

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
