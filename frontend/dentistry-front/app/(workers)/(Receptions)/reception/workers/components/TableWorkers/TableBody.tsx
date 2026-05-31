import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { format } from "date-fns";

interface TableBodyWorkerProps {
  workers: IWorker[];
}

export default function TableBodyWorker({ workers }: TableBodyWorkerProps) {
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
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td className="text-gray-900">Немає працівників</td>
          </tr>
        )}
      </tbody>
    </>
  );
}
