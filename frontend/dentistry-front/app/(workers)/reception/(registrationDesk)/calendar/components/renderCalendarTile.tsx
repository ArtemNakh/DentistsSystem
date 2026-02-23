// // import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";

// // interface RenderCalendarTileProps {
// //   appointments: IAppointment[];
// //   date: Date;
// //   view: string;
// // }

// // export default function RenderCalendarTile({
// //   appointments,
// //   date,
// //   view,
// // }: RenderCalendarTileProps) {
// //   const events = appointments.map((a) => {
// //     const time = new Date(a.appointment_date).toLocaleTimeString([], {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //     console.log("a", a);
// //     return {
// //       date: new Date(a.appointment_date),
// //       texts: [`${time} - ${a.dentist?.surname} ${a.dentist?.name}`],
// //     };
// //   });

// //   if (view !== "month") return null;
// //   const dayEvents = events.filter(
// //     (event) => event.date.toDateString() === date.toDateString(),
// //   );
// //   return (
// //     <>
// //       {/* const renderTile = ({ date, view }: { date: Date; view: string }) => { */}

// //       <div className="flex flex-col h-full hover:bg-[#7051A6] active:bg-[#6B4D9E]">
// //         {/* Верхній блок з датою */}
// //         <div className="w-full flex justify-end items-center border border-gray-400  text-white px-1 text-sm">
// //           {date.getDate()}
// //         </div>
// //         {/* Контент для записів */}
// //         <div className="flex-1  text-base p-1 text-gray-200">
// //           {dayEvents ? (
// //             <>
// //               {dayEvents.slice(0, 3).map((event, i) => (
// //                 <div key={i} className="truncate">
// //                   • {event.texts[0]}
// //                 </div>
// //               ))}
// //               {dayEvents.length > 3 && (
// //                 <div className="text-gray-400 text-sm">
// //                   + ще {dayEvents.length - 3}
// //                 </div>
// //               )}
// //             </>
// //           ) : (
// //             <span className="text-gray-400">—</span>
// //           )}
// //         </div>
// //       </div>

// //       {/* }; */}
// //     </>
// //   );
// // }

// // RenderCalendarTile.tsx
// interface RenderCalendarTileProps {
//   date: Date;
//   view: string;
//   events: { date: Date; texts: string[]; appointments: IAppointment[] }[];
// }

// export default function RenderCalendarTile({ date, view, events }: RenderCalendarTileProps) {
//   if (view !== "month") return null;

//   const dayEvents = events.find(
//     (event) => event.date.toDateString() === date.toDateString()
//   );

//   return (
//     <div className="flex flex-col h-full hover:bg-[#7051A6] active:bg-[#6B4D9E]">
//       <div className="w-full flex justify-end items-center border border-gray-400 text-white px-1 text-sm">
//         {date.getDate()}
//       </div>
//       <div className="flex-1 text-base p-1 text-gray-200">
//         {dayEvents ? (
//           <>
//             {dayEvents.texts.slice(0, 3).map((text, i) => (
//               <div key={i} className="truncate">
//                 • {text}
//               </div>
//             ))}
//             {dayEvents.texts.length > 3 && (
//               <div className="text-gray-400 text-sm">
//                 + ще {dayEvents.texts.length - 3}
//               </div>
//             )}
//           </>
//         ) : (
//           <span className="text-gray-400">—</span>
//         )}
//       </div>
//     </div>
//   );
// }


import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";

interface RenderCalendarTileProps {
  date: Date;
  view: string;
  appointments: IAppointment[];
}

export default function RenderCalendarTile({ date, view, appointments }: RenderCalendarTileProps) {
  if (view !== "month") return null;

  // Вибираємо записи саме для цього дня
  const dayAppointments = appointments.filter(
    (a) => new Date(a.appointment_date).toDateString() === date.toDateString()
  );

  return (
    <div className="flex flex-col h-full hover:bg-[#7051A6] active:bg-[#6B4D9E]">
      {/* Верхній блок з датою */}
      <div className="w-full flex justify-end items-center border border-gray-400 text-white px-1 text-sm">
        {date.getDate()}
      </div>

      {/* Контент для записів */}
      <div className="flex-1 text-base p-1 text-gray-200">
        {dayAppointments.length > 0 ? (
          <>
            {dayAppointments.slice(0, 3).map((a, i) => {
              const time = new Date(a.appointment_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={i} className="truncate">
                  • {time} - {a.dentist?.surname} {a.dentist?.name}
                </div>
              );
            })}
            {dayAppointments.length > 3 && (
              <div className="text-gray-400 text-sm">
                + ще {dayAppointments.length - 3}
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}
