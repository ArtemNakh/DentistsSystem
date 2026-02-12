export default function TableBusyDoctors() {
  // Дані для лікарів, які зараз оперують
  const operatingDoctors = [
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
    {
      doctor: "Дмитренко М.І.",
      specialization: "Хірург",
      patient: "Сидоренко Андрій",
    },
    {
      doctor: "Ковальчук О.П.",
      specialization: "Кардіохірург",
      patient: "Мельник Ігор",
    },
    {
      doctor: "Шевченко Л.В.",
      specialization: "Нейрохірург",
      patient: "Кравченко Олексій",
    },
  ];
  return (
    <>
    
      <div className="mt-8  border-2  border-gray-450 ">
        <div className="flex items-center justify-center my-3">
          <h2 className="text-xl text-center  font-bold ">
            Лікарі, які зараз оперують
          </h2>
        </div>
        <div className="max-h-96 border-2 border-gray-400 overflow-y-auto">
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Доктор</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Спеціалізація
                </th>
                <th className="px-4 py-2 text-left font-semibold">Пацієнт</th>
              </tr>
            </thead>
            <tbody>
              {operatingDoctors.map((d, i) => (
                <tr
                  key={i}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-purple-200 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-900">{d.doctor}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {d.specialization}
                  </td>
                  <td className="px-4 py-2 text-gray-900">{d.patient}</td>
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
      </div>
    </>
  );
}
