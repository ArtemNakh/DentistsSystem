// // import { useState } from "react";
// // import CreateLicenseModal from "../CreateShift/CreateShift";
// // import { useAppDispatch } from "@/lib/redux/hooks";
// // import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
// // import { DeleteShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/DeleteWorkerShifts/CreateWorkerShifts";
// // import CreateWorkerShiftModal from "../CreateShift/CreateShift";

// // interface Props {
// //   workerId: number;
// //   shifts: IWorkerShifts[];
// // }

// // export default function ListShiftsWorker({ workerId, shifts }: Props) {
// //   const dispatch = useAppDispatch();
// //   const workerShifts = shifts.filter(
// //     (lic: IWorkerShifts) => lic.worker?.id === workerId,
// //   );
// //   const [showCreateShift, setShowCreateShift] = useState(false);

// //   return (
// //     <td
// //       colSpan={7}
// //       className="border p-2 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
// //     >
// //       <div>
// //         <h3 className="font-semibold mb-2">Зміни:</h3>
// //         {workerShifts.length === 0 ? (
// //           <p className="text-gray-200"> Немає змін</p>
// //         ) : (
// //           <ul className="space-y-2">
// //             {workerShifts
// //               .slice()
// //               .sort((a, b) => {
// //                 const dateA = new Date(a.shift_date).getTime();
// //                 const dateB = new Date(b.shift_date).getTime();

// //                 if (dateA === dateB) {
// //                   return a.start_time.localeCompare(b.start_time);
// //                 }
// //                 return dateA - dateB; // від старішої до новішої
// //               })
// //               .map((lic) => (
// //                 <li
// //                   key={lic.id}
// //                   className="flex justify-between items-center border p-2 rounded"
// //                 >
// //                   <div>
// //                     <span className="font-medium">
// //                       Зміна: {new Date(lic.shift_date).toLocaleDateString()}{" "}
// //                       {lic.start_time} {lic.end_time}
// //                     </span>
// //                   </div>
// //                   <div className="flex gap-2">
// //                     <button
// //                       className="px-2 py-1 bg-[#7B4DBC] hover:bg-[#6C4DA1] border border-gray-700 text-white rounded"
// //                       onClick={() =>
// //                         dispatch(DeleteShiftsWorker({ id: lic.id }))
// //                       }
// //                     >
// //                       Видалити
// //                     </button>
// //                   </div>
// //                 </li>
// //               ))}
// //           </ul>
// //         )}
// //         <button
// //           className="mt-2 px-3 py-1 bg-[#7963AC] border border-gray-600 hover:bg-[#685594] text-white rounded"
// //           onClick={() => setShowCreateShift(true)}
// //         >
// //           Додати зміну
// //         </button>
// //       </div>
// //       {showCreateShift && (
// //         <CreateWorkerShiftModal
// //           workerId={workerId}
// //           onClose={() => setShowCreateShift(false)}
// //         />
// //       )}
// //     </td>
// //   );
// // }

// import { useState } from "react";
// import CreateWorkerShiftModal from "../CreateShift/CreateShift";
// import { useAppDispatch } from "@/lib/redux/hooks";
// import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
// import { DeleteShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/DeleteWorkerShifts/CreateWorkerShifts";

// interface Props {
//   workerId: number;
//   shifts: IWorkerShifts[];
// }

// export default function ListShiftsWorker({ workerId, shifts }: Props) {
//   const dispatch = useAppDispatch();
//   const workerShifts = shifts.filter(
//     (lic: IWorkerShifts) => lic.worker?.id === workerId,
//   );

//   const [showCreateShift, setShowCreateShift] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState<number>(
//     new Date().getMonth(), // поточний місяць за замовчуванням
//   );

//   // відфільтровані зміни лише для вибраного місяця
//   const filteredShifts = workerShifts.filter((s) => {
//     const shiftMonth = new Date(s.shift_date).getMonth();
//     return shiftMonth === selectedMonth;
//   });

//   return (
//     <td
//       colSpan={7}
//       className="border p-2 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
//     >
//       <div>
//         <h3 className="font-semibold mb-2">Зміни:</h3>

//         {/* Перемикач місяців */}
//         <div className="flex gap-2 mb-3">
//           {Array.from({ length: 12 }, (_, i) => (
//             <button
//               key={i}
//               className={`px-2 py-1 rounded ${
//                 selectedMonth === i
//                   ? "bg-[#7B4DBC] text-white"
//                   : "bg-gray-200 text-black"
//               }`}
//               onClick={() => setSelectedMonth(i)}
//             >
//               {new Date(2026, i).toLocaleString("uk-UA", { month: "long" })}
//             </button>
//           ))}
//         </div>

//         {filteredShifts.length === 0 ? (
//           <p className="text-gray-200"> Немає змін</p>
//         ) : (
//           <ul className="space-y-2">
//             {filteredShifts
//               .slice()
//               .sort((a, b) => {
//                 const dateA = new Date(a.shift_date).getTime();
//                 const dateB = new Date(b.shift_date).getTime();
//                 if (dateA === dateB) {
//                   return a.start_time.localeCompare(b.start_time);
//                 }
//                 return dateA - dateB;
//               })
//               .map((lic) => (
//                 <li
//                   key={lic.id}
//                   className="flex justify-between items-center border p-2 rounded"
//                 >
//                   <div>
//                     <span className="font-medium">
//                       Зміна: {new Date(lic.shift_date).toLocaleDateString()}{" "}
//                       {lic.start_time} {lic.end_time}
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       className="px-2 py-1 bg-[#7B4DBC] hover:bg-[#6C4DA1] border border-gray-700 text-white rounded"
//                       onClick={() =>
//                         dispatch(DeleteShiftsWorker({ id: lic.id }))
//                       }
//                     >
//                       Видалити
//                     </button>
//                   </div>
//                 </li>
//               ))}
//           </ul>
//         )}

//         <button
//           className="mt-2 px-3 py-1 bg-[#7963AC] border border-gray-600 hover:bg-[#685594] text-white rounded"
//           onClick={() => setShowCreateShift(true)}
//         >
//           Додати зміну
//         </button>
//       </div>

//       {showCreateShift && (
//         <CreateWorkerShiftModal
//           workerId={workerId}
//           onClose={() => setShowCreateShift(false)}
//         />
//       )}
//     </td>
//   );
// }

import { useState } from "react";
import CreateWorkerShiftModal from "../CreateShift/CreateShift";
import { useAppDispatch } from "@/lib/redux/hooks";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { DeleteShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/DeleteWorkerShifts/CreateWorkerShifts";
import { useTranslation } from "react-i18next";

interface Props {
  workerId: number;
  shifts: IWorkerShifts[];
}

export default function ListShiftsWorker({ workerId, shifts }: Props) {
  const { t ,i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const workerShifts = shifts.filter(
    (lic: IWorkerShifts) => lic.worker?.id === workerId,
  );

  const [showCreateShift, setShowCreateShift] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  // відфільтровані зміни лише для вибраного місяця і року
  const filteredShifts = workerShifts.filter((s) => {
    const date = new Date(s.shift_date);
    return (
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    );
  });

  // список років на основі даних (щоб не хардкодити)
  const availableYears = Array.from(
    new Set(workerShifts.map((s) => new Date(s.shift_date).getFullYear())),
  ).sort((a, b) => a - b);

  return (
    <td
      colSpan={7}
      className="border p-2 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
    >
      <div>
        <h3 className="font-semibold mb-2">{t("doctor.workers_shifts.shifts.name")}:</h3>

       <div className="flex gap-2 mb-3 flex-wrap">
  {Array.from({ length: 12 }, (_, i) => (
    <button
      key={i}
      className={`px-2 py-1 rounded ${
        selectedMonth === i
          ? "bg-[#7B4DBC] text-white"
          : "bg-gray-200 text-black"
      }`}
      onClick={() => setSelectedMonth(i)}
    >
      {new Date(2026, i).toLocaleString(i18n.language, { month: "long" })}
    </button>
  ))}
</div>

        {/* Перемикач років */}
        {/* Перемикач років */}
        <div className="flex flex-wrap gap-2 mb-3">
          {availableYears.map((year) => (
            <button
              key={year}
              className={`px-2 py-1 rounded ${
                selectedYear === year
                  ? "bg-[#7B4DBC] text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {filteredShifts.length === 0 ? (
          <p className="text-gray-200"> Немає змін</p>
        ) : (
          <ul className="space-y-2">
            {filteredShifts
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a.shift_date).getTime();
                const dateB = new Date(b.shift_date).getTime();
                if (dateA === dateB) {
                  return a.start_time.localeCompare(b.start_time);
                }
                return dateA - dateB;
              })
              .map((lic) => (
                <li
                  key={lic.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <span className="font-medium">
                      {t("doctor.workers_shifts.shifts.value_shift")}: {new Date(lic.shift_date).toLocaleDateString()}{" "}
                      {lic.start_time} {lic.end_time}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-[#7B4DBC] hover:bg-[#6C4DA1] border border-gray-700 text-white rounded"
                      onClick={() =>
                        dispatch(DeleteShiftsWorker({ id: lic.id }))
                      }
                    >
                      {t("doctor.workers_shifts.shifts.delete")}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}

        <button
          className="mt-2 px-3 py-1 bg-[#7963AC] border border-gray-600 hover:bg-[#685594] text-white rounded"
          onClick={() => setShowCreateShift(true)}
        >
        {t("doctor.workers_shifts.shifts.add_shift")}
        </button>
      </div>

      {showCreateShift && (
        <CreateWorkerShiftModal
          workerId={workerId}
          onClose={() => setShowCreateShift(false)}
        />
      )}
    </td>
  );
}
