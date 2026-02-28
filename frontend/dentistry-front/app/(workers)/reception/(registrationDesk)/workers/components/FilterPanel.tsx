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
  return (
    <>
      <div className=" w-full">
        <div className="mx-4    border border-gray-600  flex items-center gap-4 p-2  ">
          <div className="flex flex-col">
            <label className="text-lg text-gray-200">Фіо</label>
            <input
              value={filters.fio}
              onChange={(e) => setFilters({ ...filters, fio: e.target.value })}
              className="h-10 w-100 text-lg border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-gray-200">Specialty</label>
            <input
              value={filters.specialty}
              onChange={(e) =>
                setFilters({ ...filters, specialty: e.target.value })
              }
              className="h-10 w-60 text-lg border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-gray-200">Birthday</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="dd.mm.yyyy"
                value={filters.birthday}
                onChange={(e) =>
                  setFilters({ ...filters, birthday: e.target.value })
                }
                className="h-10 w-40 text-lg border border-gray-600 rounded px-2 focus:outline-none"
                pattern="\d{2}\.\d{2}\.\d{4}"
              />
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
