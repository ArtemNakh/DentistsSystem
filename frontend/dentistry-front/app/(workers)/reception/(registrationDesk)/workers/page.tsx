// показ усіх працівників ,фіо ,кнопка часи роботи яка
// перенаправляє користувача на сторінку календаря але
//  із фільтром працівника і показує тільки його розклад
"use client";
import { useState } from "react";

export default function WorkerReception() {
  const [yearFilter, setYearFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  // const workers=[];
  const workers = [
    {
      id: "123321123",
      name: "asdewq",
      surname: "qweewq",
      middle_name: "zxccxz",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
    {
      id: "123321123",
      name: "Гінекологічна операція",
      surname: "03.02.2026",
      middle_name: "werwerwer",
      birthday: "12.02.2023",
      phone: "123123123",
      specialtyId: "1",
      dentistryId: "12",

      login: "qweqweqwe",
      password: "qweqweqwe",
    },
  ];

  // Фільтрація за роком народження
  // Фільтрація за повною датою народження
  const filteredWorkers = workers.filter((w) => {
    if (!dateFilter) return true;
    return w.birthday === dateFilter;
  });

  const specialty = {
    id: "1",
    name: "hrurh",
    description: "testspecial",
    type: "ENUM('doctor','admin')",
  };
  const dentistry = {
    id: "12",
    street: "teststr",
    city: "tecit",
    region: "testreg",
  };
  return (
    <>
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
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-10 w-40 text-lg border border-gray-600 rounded px-2 focus:outline-none"
                  pattern="\d{2}\.\d{2}\.\d{4}"
                />
                <button
                  onClick={() => setAppliedFilter(dateFilter)}
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
            {workers.length > 0 ? (
              <table className="w-full   border-collapse border border-gray-600 text-lg">
                <thead className="">
                  <tr>
                    <th className="border border-gray-400 px-2 py-1">ФІО</th>
                    <th className="border w-72 border-gray-400 px-1 py-1">
                      Specialty
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Дата народження
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Телефон
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((text) => (
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
                          <div className="mx-1">{text.name}</div>
                          <div className="mr-1">{text.surname}</div>
                          <div>{text.middle_name}</div>
                        </div>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.specialtyId}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.birthday}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.phone}
                      </td>
                      <td className="border border-gray-600 px-2 py-2 text-center">
                        <button
                          onClick={() =>
                            alert(
                              `Перехід на календар для працівника: ${text.name}`,
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
