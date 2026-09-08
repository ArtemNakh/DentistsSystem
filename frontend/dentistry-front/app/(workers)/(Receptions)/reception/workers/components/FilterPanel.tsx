import { useTranslation } from "react-i18next";

// окремий тип для фільтрів
export interface WorkerFilters {
  fio: string;
  specialty: string;
  birthday: string;
}

// тип пропсів для компонента
interface FilterPanelProps {
  filters: WorkerFilters;
  setFilters: React.Dispatch<React.SetStateAction<WorkerFilters>>;
}

export default function FilterPanelWorkers({
  filters,
  setFilters,
}: FilterPanelProps) {
    const { t } = useTranslation();
  return (
    <>
    <div className="w-full">
      <div className="mx-4 text-base border border-gray-600 flex flex-wrap gap-4 p-2">
        {/* FIO */}
        <div className="flex flex-col flex-1 min-w-50">
          <label className="text-gray-200">
            {t("reception.workers.filters.fio")}
          </label>
          <input
            value={filters.fio}
            placeholder={t("reception.workers.filters.placeholder_fio")}
            onChange={(e) => setFilters({ ...filters, fio: e.target.value })}
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>

        {/* Specialty */}
        <div className="flex flex-col flex-1 min-w-40">
          <label className="text-gray-200">
            {t("reception.workers.filters.specialty")}
          </label>
          <input
            value={filters.specialty}
            placeholder={t("reception.workers.filters.placeholder_specialty")}
            onChange={(e) =>
              setFilters({ ...filters, specialty: e.target.value })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>

        {/* Birthday */}
        <div className="flex flex-col flex-1 min-w-35">
          <label className="text-gray-200">
            {t("reception.workers.filters.birthday")}
          </label>
          <input
            type="text"
            placeholder="dd.mm.yyyy"
            value={filters.birthday}
            onChange={(e) =>
              setFilters({ ...filters, birthday: e.target.value })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
            pattern="\d{2}\.\d{2}\.\d{4}"
          />
        </div>
      </div>
    </div>
  
    </>
  );
}
