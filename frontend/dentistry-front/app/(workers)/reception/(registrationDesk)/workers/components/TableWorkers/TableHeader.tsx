interface TableHeaderWorkerProps {}

export default function TableHeaderWorker({}: TableHeaderWorkerProps) {
  return (
    <>
      <thead className="">
        <tr>
          <th className="border border-gray-400 w-1/2  px-2 py-1">ФІО</th>
          <th className="border  border-gray-400 w-auto  px-1 py-1">
            Specialty
          </th>
          <th className="border border-gray-400  w-32 px-2 py-1">
            Дата народження
          </th>
          <th className="border border-gray-400 px-2 w-40 py-1">Телефон</th>
          <th className="border border-gray-400 px-2 py-1">Actions</th>
        </tr>
      </thead>
    </>
  );
}
