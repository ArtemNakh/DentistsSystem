"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import FilterPanelWorkers from "./components/FilterPanel";
import ListWorkersWorker from "./components/ListWorkers";
import CreateWorkerModal from "./ModalView/AddingNewWorkerField/CreateWorkerModal";


interface WorkerReceptionProps {}

export default function WorkerReception({}: WorkerReceptionProps) {
  const [filters, setFilters] = useState({
    fio: "",
    specialty: "",
    birthday: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  return (
    <>
      <div className="font-bold ">
        {/* Фільтр */}
        <FilterPanelWorkers filters={filters} setFilters={setFilters} />
        {/* Кнопка додавання */}
        <div className="flex justify-end gap-2 my-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="border border-gray-450 mr-4 hover:bg-[#7C4ABF] text-white px-4 py-2 rounded"
          >
            Додати працівника
          </button>
        </div>

        {/* Список працівників */}
        <ListWorkersWorker filters={filters} />
      </div>
      {/* Модальне вікно */}
      {showCreateModal && (
        <CreateWorkerModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
