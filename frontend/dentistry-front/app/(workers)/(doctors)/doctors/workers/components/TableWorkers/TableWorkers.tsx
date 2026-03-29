import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import TableHeaderWorker from "./TableHeader";
import TableBodyWorker from "./TableBody";


interface TableWorkersProps {
  workers: IWorker[];
  selectedWorker: IWorker | null;
  onSelectWorker: (worker: IWorker) => void;
}


export default function TableWorkers({
   workers,
  selectedWorker,
  onSelectWorker,
}: TableWorkersProps) {
  return (
    <>
      <table className="w-full   border-collapse border border-gray-600 text-base">
        <TableHeaderWorker />

      <TableBodyWorker
        workers={workers}
        onSelectWorker={onSelectWorker}
      />
      </table>
    </>
  );
}
