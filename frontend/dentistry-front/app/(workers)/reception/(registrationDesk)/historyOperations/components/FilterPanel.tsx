export interface HistoryFilters {
  fioClient: string;
  fioWorker: string;
  specialty: string;
  statusPaid: string;
  appointment_date: string;
}

interface FilterPanelProps {
  filters: HistoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<HistoryFilters>>;
}

export default function FilterPanelHistory({
  filters,
  setFilters,
}: FilterPanelProps) {
  return (
    <>
      <div className=" w-full">
        <div className="mx-4  text-base  border border-gray-600  flex items-center gap-4 p-2  ">
          <div className="flex flex-col">
            <label className=" text-gray-200">Фіо Client</label>
            <input
              value={filters.fioClient}
              onChange={(e) =>
                setFilters({ ...filters, fioClient: e.target.value })
              }
              className="h-10 w-80  border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className=" text-gray-200">Фіо Worker</label>
            <input
              value={filters.fioWorker}
              onChange={(e) =>
                setFilters({ ...filters, fioWorker: e.target.value })
              }
              className="h-10 w-80 border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className=" text-gray-200">Specialty</label>
            <input
              value={filters.specialty}
              onChange={(e) =>
                setFilters({ ...filters, specialty: e.target.value })
              }
              className="h-10 w-60  border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className=" text-gray-200">Status Paid </label>
            <input
              value={filters.statusPaid}
              onChange={(e) =>
                setFilters({ ...filters, statusPaid: e.target.value })
              }
              className="h-10 w-30  border border-gray-600 rounded px-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className=" text-gray-200">Day</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="dd.mm.yyyy"
                value={filters.appointment_date}
                onChange={(e) =>
                  setFilters({ ...filters, appointment_date: e.target.value })
                }
                className="h-10 w-40  border border-gray-600 rounded px-2 focus:outline-none"
                pattern="\d{2}\.\d{2}\.\d{4}"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
