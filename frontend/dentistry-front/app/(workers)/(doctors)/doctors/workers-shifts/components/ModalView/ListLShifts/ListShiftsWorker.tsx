import { useState } from "react";
import CreateLicenseModal from "../CreateShift/CreateShift";
import { useAppDispatch } from "@/lib/redux/hooks";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { DeleteShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/DeleteWorkerShifts/CreateWorkerShifts";
import CreateWorkerShiftModal from "../CreateShift/CreateShift";

interface Props {
  workerId: number;
  shifts: IWorkerShifts[];
}

export default function ListShiftsWorker({ workerId, shifts }: Props) {
  const dispatch = useAppDispatch();
  const workerShifts = shifts.filter(
    (lic: IWorkerShifts) => lic.worker?.id === workerId,
  );
  const [showCreateShift, setShowCreateShift] = useState(false);

  return (
    <td
      colSpan={7}
      className="border p-2 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
    >
      <div>
        <h3 className="font-semibold mb-2">Зміни:</h3>
        {workerShifts.length === 0 ? (
          <p className="text-gray-200"> Немає змін</p>
        ) : (
          <ul className="space-y-2">
            {workerShifts
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a.shift_date).getTime();
                const dateB = new Date(b.shift_date).getTime();

                if (dateA === dateB) {
                  return a.start_time.localeCompare(b.start_time);
                }
                return dateA - dateB; // від старішої до новішої
              })
              .map((lic) => (
                <li
                  key={lic.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <span className="font-medium">
                      Зміна: {new Date(lic.shift_date).toLocaleDateString()}{" "}
                      {lic.start_time} {lic.end_time}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-[#7B4DBC] hover:bg-[#6C4DA1] border border-gray-700 text-white rounded"
                      onClick={() =>
                        dispatch(DeleteShiftsWorker({ id: lic.id }))
                      }
                    >
                      Видалити
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
        <button
          className="mt-2 px-3 py-1 bg-[#7963AC] border border-gray-600 hover:bg-[#685594] text-white rounded"
          onClick={() => setShowCreateShift(true)}
        >
          Додати зміну
        </button>
      </div>
      {showCreateShift && (
        <CreateWorkerShiftModal
          workerId={workerId}
          onClose={() => setShowCreateShift(false)}
        />
      )}
    </td>
  );
}
