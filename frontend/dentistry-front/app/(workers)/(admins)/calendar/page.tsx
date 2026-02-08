"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import HeaderAdmin from "../components/Header";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ClientActionSaga } from "@/lib/redux/modules/clients/ClientEntity";

// Виправити помилку redux
// Додати модальне вікно як у каледнарі тимса (у обраного об'єкта після натискання додажться можадьне вікно)
export default function CalendarAdmin() {
  // const dispatch = useAppDispatch(); // отримуємо дані зі стору
  // const clients = useAppSelector((state) => state.Clients);
  // useEffect(() => {
  //   // при монтуванні сторінки завантажуємо клієнтів
  //   dispatch({ type: ClientActionSaga.GetClients });
  // }, [dispatch]);

  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    { date: new Date(2026, 1, 8), texts: ["Запис 1", "Запис 2", "Запис 3"] },
    { date: new Date(2026, 1, 9), texts: ["Інший запис", "Ще один"] },
  ]);

  const [infoRecord, setInfoRecord] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const renderTile = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayEvents = events.find(
        (event) => event.date.toDateString() === date.toDateString(),
      );
      return (
        <div className="flex flex-col h-full hover:bg-[#7051A6] active:bg-[#6B4D9E]">
          {/* Верхній блок з датою */}
          <div className="w-full flex justify-end items-center border border-gray-400  text-white px-1 text-sm">
            {date.getDate()}
          </div>
          {/* Контент для записів */}
          <div className="flex-1  text-base p-1 text-gray-200">
            {dayEvents ? (
              <>
                {dayEvents.texts.slice(0, 3).map((text, i) => (
                  <div key={i} className="truncate">
                    • {text}
                  </div>
                ))}
                {dayEvents.texts.length > 3 && (
                  <div className="text-gray-400 text-sm">
                    + ще {dayEvents.texts.length - 3}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>

          {/* <div className="flex-1 overflow-hidden text-base p-1 text-gray-200">
            {dayEvents ? (
              dayEvents.texts.map((text, i) => (
                <div key={i} className="truncate">
                  • {text}
                </div>
              ))
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div> */}
        </div>
      );
    }
    return null;

    //   const dayEvents = events.find(
    //     (event) => event.date.toDateString() === date.toDateString(),
    //   );
    //   if (dayEvents) {
    //     return (
    //       <div className=" text-xs text-gray-700">
    //         {dayEvents.texts.map((text, i) => (
    //           <div key={i}>• {text}</div>
    //         ))}
    //       </div>
    //     );
    //   }
    // }
    // return null;
  };

  const selectedEvents = events.find(
    (event) => event.date.toDateString() === value.toDateString(),
  );

  const addEvent = (date: Date, text: string) => {
    setEvents((prevEvents) => {
      const existing = prevEvents.find(
        (e) => e.date.toDateString() === date.toDateString(),
      );
      if (existing) {
        return prevEvents.map((e) =>
          e.date.toDateString() === date.toDateString()
            ? { ...e, texts: [...e.texts, text] }
            : e,
        );
      }
      return [...prevEvents, { date, texts: [text] }];
    });
  };

  const removeEvent = (date: Date, index: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.date.toDateString() === date.toDateString()
          ? { ...event, texts: event.texts.filter((_, i) => i !== index) }
          : event,
      ),
    );
  };

  return (
    <>
      <HeaderAdmin />
      {/* test */}
      {/* <div>
            {" "}
            <h2>Список клієнтів</h2>{" "}
            <ul>
              {" "}
              {Object.values(clients).map((client) => (
                <li key={client.id}>
                  {" "}
                  {client.surname} {client.name} ({client.phone}){" "}
                </li>
              ))}{" "}
            </ul>{" "}
          </div> */}

      {/* test end */}
      <div className=" flex  h-screen ">
        {/* lefft side */}
        {/* calendar */}
        <div className=" relative flex-1  overflow-visible w-max h-screen flex flex-col items-center justify-center">
          <Calendar
            value={value}
            onChange={setValue}
            tileContent={renderTile}
            tileClassName={({ date, view }) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return `relative h-30 border ${isToday ? "border-yellow-500" : "border-gray-300"} bg-linear-to-r from-[#7F59BD] to-[#795EAF]`;
            }}
            className="calendar-admin bg-linear-to-l from-[#874FD1] to-[#6F6697] w-full h-full  "
            minDetail="month"
            maxDetail="month"
          />
        </div>

        {/* Right part */}
        {/* Права частина */}
        <div className="w-80 border border-gray-400   bg-linear-to-r from-[#874FD1] to-[#7562A5] flex flex-col h-full">
          <div className="">
            <button
              onClick={() => addEvent(value, "Нова подія")}
              className="border border-gray-400 m-2 px-2 py-1 hover:bg-[#7D4DBF] active:bg-[#6C43A6]"
            >
              Add
            </button>
          </div>
          <div
            className="flex-1 p-4   overflow-auto scrollbar-thin 
                scrollbar-thumb-[#7D4DBF] scrollbar-track-[#6F6697]"
          >
            <h2 className="text-lg font-bold mb-2">
              Записи на {value.toLocaleDateString()}
            </h2>
            {selectedEvents ? (
              <ul className="list-disc pl-5">
                {selectedEvents.texts.map((text, i) => (
                  <li
                    key={i}
                    className="relative flex justify-between items-center border border-gray-400 p-1 px-2 my-2 cursor-pointer"
                    onClick={(e) => {
                      const rect = (
                        e.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      setSelectedText(text);
                      // позиція зліва: беремо rect.left і віднімаємо ширину модалки (наприклад 180px)
                      setModalPos({ x: rect.left - 180, y: rect.top });
                      setInfoRecord(true);
                    }}
                  >
                    <span>{text}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEvent(selectedEvents.date, i);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Немає записів для цього дня</p>
            )}
          </div>
        </div>

        {/* Модалка рендериться окремо */}
        {/* додати інформацію про запис , хто що як і тюдю, як у тимсі */}
        {infoRecord && selectedText && modalPos && (
          <div
            className="fixed top-0 left-0  bg-gray-400 w-40 h-20 p-2 rounded z-50"
            style={{ top: modalPos.y, left: modalPos.x }}
          >
            <p>{selectedText}</p>
            <button
              onClick={() => setInfoRecord(false)}
              className="mt-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Закрити
            </button>
          </div>
        )}
      </div>
    </>
  );
}
