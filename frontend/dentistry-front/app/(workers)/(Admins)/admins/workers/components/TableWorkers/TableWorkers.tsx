import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import TableHeaderWorker from "./TableHeader";
import TableBodyWorker from "./TableBody";

interface TableWorkersProps {
  workers: IWorker[];
  onSelectWorker: (worker: IWorker) => void;
}

export default function TableWorkers({
  workers,
  onSelectWorker,
}: TableWorkersProps) {
  return (
    <>
      <table className="w-full overflow-scroll  border-collapse border border-gray-600 text-base">
        <TableHeaderWorker />

        <TableBodyWorker workers={workers} onSelectWorker={onSelectWorker} />
      </table>
    </>
  );
}
