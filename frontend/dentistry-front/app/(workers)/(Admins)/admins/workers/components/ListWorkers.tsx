import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";

import TableWorkers from "./TableWorkers/TableWorkers";
import { format } from "date-fns";
import { WorkerFilters } from "./FilterPanel";
import { useEffect, useState } from "react";
import { getWorkersDentistry } from "@/lib/redux/modules/Workers/actions/GetWorkersDentistry/GetWorkersDentistry";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import UpdateWorkerModal from "../ModalView/UpdateWorkerView/UpdateWorkerModal";

interface ListWorkersWorkerProps {
  filters: WorkerFilters;
}

export default function ListWorkersWorker({ filters }: ListWorkersWorkerProps) {
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const dispatch = useAppDispatch();

  const [selectedWorker, setSelectedWorker] = useState<IWorker | null>(null);
  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;
    dispatch(getWorkersDentistry({ idDentistry: authUser.user?.dentistry.id }));
  }, [authUser]);

  const workers = Object.values(
    UseDenormalizeSelector<IWorker[]>((state: RootState) => state.workers),
  ).filter((worker) => worker?.dentistry?.id === authUser.user?.dentistry?.id);

  const filteredWorkers = workers.filter((w) => {
    const fioMatch =
      !filters.fio ||
      `${w.name} ${w.surname} ${w.middle_name}`
        .toLowerCase()
        .includes(filters.fio.toLowerCase());
    const specialtyMatch =
      !filters.specialty ||
      w.specialty.name.toLowerCase().includes(filters.specialty.toLowerCase());
    const birthdayMatch =
      !filters.birthday ||
      format(new Date(w.birthday), "dd.MM.yyyy") === filters.birthday;
    return fioMatch && specialtyMatch && birthdayMatch;
  });

  return (
    <>
      <div className="w-full ">
        <div className="mx-4  overflow-x-scroll">
          <TableWorkers
            workers={filteredWorkers}
            onSelectWorker={setSelectedWorker}
          />

          {selectedWorker && (
            <UpdateWorkerModal
              worker={selectedWorker}
              onClose={() => setSelectedWorker(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
