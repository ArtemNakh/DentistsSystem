import { useEffect, useState } from "react";

export default function TableUpcomingEntries() {
  const [selectedTask, setSelectedTask] = useState<{
    action: string;
    index: number;
  } | null>(null);

  const tasks = [
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Петренко Іван Сергійович",
      time: "12:00",
      action: "Консультація",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Коваль Олена Петрівна",
      time: "14:30",
      action: "Огляд",
    },
    {
      doctor: "Дмитренко М І",
      patient: "Сидоренко Андрій Миколайович",
      time: "16:00",
      action: "Прийом",
    },
  ];

  return (
    <>
      <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-center text-2xl    bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
          Найближчі записи
        </h1>

        {/* показ Списку записів */}
        <ul className="divide-y divide-gray-200">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="relative grid grid-cols-[200px_1fr_80px] bg-white hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() =>
                selectedTask?.index === index
                  ? setSelectedTask(null)
                  : setSelectedTask({ action: task.action, index })
              }
            >
              <span className="px-3 py-2 font-semibold text-gray-900">
                {task.doctor}
              </span>
              <span className="px-3 py-2 text-gray-700">{task.patient}</span>
              <span className="px-3 py-2 text-gray-700">{task.time}</span>

              {/* маленьке модальне вікно напроти вибраного рядка */}
              {selectedTask && selectedTask.index === index && (
                <div className="absolute top-0  left-full overflow-visible w-36 ml-2 border-2 border-gray-500 bg-gray-100 text-gray-900 rounded-md shadow-lg px-3 py-2 text-sm ">
                  {selectedTask.action}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
