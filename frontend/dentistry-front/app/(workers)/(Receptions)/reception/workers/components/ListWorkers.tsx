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
import { useTranslation } from "react-i18next";

interface ListWorkersWorkerProps {
  filters: WorkerFilters;
}

export default function ListWorkersWorker({ filters }: ListWorkersWorkerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const workers: IWorker[] = Object.values(
    UseDenormalizeSelector<IWorker[]>((state: RootState) => state.workers),
  );

  const [skip, setSkip] = useState(0);
  const takeWorkers = 50;

  useEffect(() => {
    if (authUser) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) return;
    dispatch(
      getWorkersDentistry({
        idDentistry: authUser?.dentistry.id,
        skip: skip,
        take: takeWorkers,
      }),
    );
  }, [authUser, skip]);

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
      <div className="w-full   ">
        <div className="mx-4 overflow-scroll">
          <TableWorkers workers={filteredWorkers} />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setSkip((prev) => prev + takeWorkers)}
            className="px-4 py-2 mb-5 border border-gray-700 bg-[#6f3aaf] text-white rounded scale-100  hover:scale-105 hover:bg-[#7946b7] transition"
          >
            {t("reception.load_more")}
          </button>
        </div>
      </div>
    </>
  );
}
