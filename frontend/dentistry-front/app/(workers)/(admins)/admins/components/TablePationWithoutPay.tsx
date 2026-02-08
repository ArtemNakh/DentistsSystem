export default function TablePationWithoutPay() {
  const unpaidPatients = [
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
    { name: "Іван Петренко", operation: "Апендектомія", date: "01.02.2026" },
    {
      name: "Олена Коваль",
      operation: "Гінекологічна операція",
      date: "03.02.2026",
    },
    {
      name: "Микола Сидоренко",
      operation: "Ортопедична операція",
      date: "05.02.2026",
    },
  ];
  return (
    <>
      <div className="mt-5  border-2  border-gray-450">
        <div className="flex items-center justify-center my-3">
          <h2 className="text-xl text-center  font-bold ">
            Пацієнти без оплати
          </h2>
        </div>
        {/* Лічильник */}

        {/* Контейнер зі скролом */}
        <div className="max-h-96 overflow-y-auto border border-gray-400 rounded">
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-linear-to-r from-[#6F6697] to-[#874FD1] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Пацієнт</th>
                <th className="px-4 py-2 text-left font-semibold">Операція</th>
                <th className="px-4 py-2 text-left font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody>
              {unpaidPatients.slice(0, 50).map((p, i) => (
                <tr
                  key={i}
                  className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-800">{p.name}</td>
                  <td className="px-4 py-2 text-gray-800">{p.operation}</td>
                  <td className="px-4 py-2 text-gray-800">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
      </div>
    </>
  );
}
