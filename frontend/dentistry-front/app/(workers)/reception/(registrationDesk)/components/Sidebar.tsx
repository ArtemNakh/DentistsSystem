import Link from "next/link";
import { useState } from "react";
interface SidebarItem {
  label: string;
  path: string;
}

interface SideBarAdminsProps {
  items: SidebarItem[]; // масив рядків для пунктів меню
  onClose: () => void; // функція закриття
}

export default function SideBarAdmins({ items, onClose }: SideBarAdminsProps) {
  return (
    <>
      <div className="fixed top-0 left-0 w-64 h-full bg-linear-to-b from-[#64359A] to-[#534A79] text-gray-300 shadow-lg z-50">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-bold">Меню</h2>
          <button onClick={onClose} className="text-red-400">
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-4">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded cursor-pointer"
            >
              <Link className="block w-full h-full" href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* напівпрозорий фон */}
      <div
        onClick={onClose}
        className="fixed inset-0 backdrop-brightness-50 z-40"
      ></div>
    </>
  );
}

//   return (
//     <>
//       {/* Сайдбар */}
//       {/* додати бордер для кнопок у сайдбарі, такого ж кольору як на сторінці логіна */}
//       {leftSideBar && (
//         <div className="fixed top-0 left-0 w-64 h-full bg-linear-to-b from-[#64359A] to-[#534A79]  text-gray-300 shadow-lg z-50">
//           <div className="p-4 flex justify-between items-center border-b border-gray-700">
//             <h2 className="text-lg font-bold">Меню</h2>
//             <button
//               onClick={() => setLeftSideBar(false)}
//               className="text-red-400"
//             >
//               ✕
//             </button>
//           </div>

//           <ul className="p-4 space-y-4">
//             <li className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded ">
//               Календар
//             </li>
//             <li className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded">
//               Режим роботи
//             </li>
//             <li className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded">
//               Оплата
//             </li>
//             <li className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded">
//               Працівники
//             </li>
//             <li className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded">
//               Історія операцій
//             </li>
//           </ul>
//         </div>
//       )}
//       {/* Напівпрозорий фон позаду (щоб накладалося поверх інших вікон) */}
//       {leftSideBar && (
//         <div
//           onClick={() => setLeftSideBar(false)}
//           className="fixed inset-0 backdrop-brightness-50 z-40"
//         ></div>
//       )}
//       {/* додати поле вспливаюче поле поверх інших вікон де будуть усі унші вікна(як у майстат) */}
//       {/* поля */}
//       {/* календар (додавання ,видалення зписі клієнта)*/}
//       {/* режим роботи(додавання видалення вихідних для докторів) (показується який доктор, професія, коли працює) */}
//       {/* оплата */}
//       {/* Працівники */}
//       {/* Історія операцій */}
//     </>
//   );
// }
