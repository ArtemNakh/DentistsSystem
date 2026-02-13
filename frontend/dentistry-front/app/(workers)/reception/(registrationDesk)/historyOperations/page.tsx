// сторінка яка показує усі операції для стоматології (із фільтром текущії, заплановані, зроблені,скасовано)
export default function HistoryOperationReception() {
  const operation = [
    {
      id: "123",
      client_id: "321",
      worker_id: "321",
      appointment_date: "12.32.2121",
      notes: "test",
      status: "schedule completed wait_paid cancelled",
    },
  ];
  return (
    <>
      {" "}
      <div className="font-bold ">
        {/* Фільтр */}

        <div className=" w-full">
          <div className="mx-4    border border-gray-600  flex items-center gap-4 p-2  ">
            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Фіо</label>
              <input className="h-10 w-100 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Specialty</label>
              <input className="h-10 w-60 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Birthday</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="dd.mm.yyyy"
                  // value={}
                  // onChange={}
                  className="h-10 w-40 text-lg border border-gray-600 rounded px-2 focus:outline-none"
                  pattern="\d{2}\.\d{2}\.\d{4}"
                />
                <button
                
                  className="h-10 px-4 text-lg rounded border border-gray-600 hover: text-gray-200"
                >
                  Застосувати
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Список працівників */}

        <div className="w-full  ">
          <div className="mx-4">
            {operation.length > 0 ? (
              <table className="w-full   border-collapse border border-gray-600 text-lg">
                <thead className="">
                  <tr>
                    <th className="border border-gray-400 px-2 py-1">Client</th>
                    <th className="border w-72 border-gray-400 px-1 py-1">
                      Worker
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Дата operation
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Status operaiton
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operation.map((text) => (
                    <tr
                      key={text.id}
                      className="bg-gray-100  text-gray-700 hover:bg-gray-100"
                    >
                      {/* <td className="border  border-gray-400 px-2 py-1 flex ">
                      <div className="mx-1"> {text.name}</div>
                      <div className="mr-1">{text.surname}</div>
                      <div>{text.middle_name}</div>
                      </td> */}
                      <td className="border border-gray-400 px-2 py-1">
                        <div className="flex h-full items-center">
                          <div className="mx-1">{text.client_id}</div>
                        </div>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.worker_id}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.appointment_date}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.status}
                      </td>
                      <td className="border border-gray-600 px-2 py-2 text-center">
                        <button className=" text-gray-900 px-3 py-2 rounded hover:bg-[#795FAE] transition flex items-center justify-center">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-gray-900">Немає працівників</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
