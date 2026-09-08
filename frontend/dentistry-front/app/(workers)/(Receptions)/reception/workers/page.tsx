"use client";

import { useState } from "react";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";

interface WorkerReceptionProps{

}

export default function WorkerReception({}: WorkerReceptionProps) {


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
