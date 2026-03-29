import { useAppDispatch } from "@/lib/redux/hooks";
import { deActiveWorker } from "@/lib/redux/modules/Workers/actions/DeActiveWorker/DeActiveWorker";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { format } from "date-fns";
import { useState } from "react";
import UpdateWorkerModal from "../../ModalView/UpdateWorkerView/UpdateWorkerModal";



interface TableBodyWorkerProps {
  workers: IWorker[];
  onSelectWorker: (worker: IWorker) => void;
}
export default function TableBodyWorker({ workers, onSelectWorker }: TableBodyWorkerProps) {
  const dispatch = useAppDispatch();
  return (
    <>
      <tbody>
        {!workers ? (
          <tr>
            <td className="text-gray-900">Loading...</td>
          </tr>
        ) : workers.length > 0 ? (
          <>
            {workers.map((worker) => (
              <tr
                key={worker.id}
                className="bg-gray-100  text-gray-700 hover:bg-gray-100"
              >
                <td className="border border-gray-400 px-2 py-1">
                  <div className="flex h-full items-center">
                    <div className="mx-1">{worker.name}</div>
                    <div className="mr-1">{worker.surname}</div>
                    <div>{worker.middle_name}</div>
                  </div>
                </td>
                <td className="border border-gray-400 w-auto px-2 py-1">
                  {/* {console.log("testqwe",worker.specialty.name)} */}
                  {worker.specialty?.name}
                </td>
                <td className="border border-gray-400 w-32 px-2 py-1">
                  {/* {worker.birthday} */}
                  {format(new Date(worker.birthday), "dd.MM.yyyy")}
                </td>
                <td className="border border-gray-400 w-40 px-2 py-1">
                  {worker.phone}
                </td>
                <td className="border border-gray-600 px-2 py-2 text-center">
                  <button
                    onClick={() =>
                      alert(
                        `Перехід на календар для працівника: ${worker.surname}`,
                      )
                    }
                    className=" text-gray-900 px-3 py-2 rounded hover:bg-[#795FAE] transition flex items-center justify-center"
                  >
                    {/* SVG іконка календаря */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  {/* Нова кнопка dispatch */}
                  <button
                    onClick={() => {
                      console.log("deletedWorker", worker.id);
                      dispatch(deActiveWorker({ idWorker: worker.id }));
                    }}
                    className="text-gray-700 border  px-3 py-2 rounded hover:bg-[#795FAE] transition"
                  >
                    Видалити
                  </button>
                  <button
                    onClick={() => onSelectWorker(worker)}
                    className="text-gray-700 border px-3 py-2 rounded hover:bg-green-500 transition"
                  >
                    Оновити
                  </button>
                </td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td className="text-gray-900">Немає працівників</td>
          </tr>
        )}
      </tbody>

      {/* Модальне вікно рендериться окремо */}
    </>
  );
}
