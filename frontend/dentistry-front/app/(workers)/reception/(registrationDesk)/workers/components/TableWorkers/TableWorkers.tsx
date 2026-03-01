import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import TableHeaderWorker from "./TableHeader";
import TableBodyWorker from "./TableBody";
export default function TableWorkers({ workers }: { workers: IWorker[] }) {
  return (
    <>
      <table className="w-full   border-collapse border border-gray-600 text-base">
        <TableHeaderWorker />
        <TableBodyWorker workers={workers} />
      </table>
    </>
  );
}
