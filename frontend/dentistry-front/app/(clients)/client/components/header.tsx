"use client";
import { useState } from "react";
import SideBarAdmins from "./Sidebar";

export default function HeaderClient() {
  const [leftSideBar, setLeftSideBar] = useState(false);

  // список кнопок для сайдбару
  const sidebarItems = [
    { label: "Історія операцій", path: "/client/historyOperations" },
    { label: "Запис на операцію", path: "/client/create-appointment" },
  ];

  return (
    
    <div className="bg-gray-400 border border-gray-600 z-30">
      <div className="flex items-center justify-between h-16 px-6 shadow-md">
        {/* Ліва кнопка */}
        <div>
          <button
            onClick={() => setLeftSideBar(true)}
            className="px-4 py-2 text-white rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {leftSideBar && (
            <SideBarAdmins
              items={sidebarItems}
              onClose={() => setLeftSideBar(false)}
            />
          )}
        </div>

        {/* Навігація справа */}
        <nav className="flex items-center space-x-6">
          <a
            href="/"
            className="text-gray-900 font-medium hover:text-yellow-600 transition-colors"
          >
            Головна
          </a>
          <a
            href="/about"
            className="text-gray-900 font-medium hover:text-yellow-600 transition-colors"
          >
            Про нас
          </a>

          {/* Фото користувача */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500">
            <img
              src="/userAvatar.png"
              alt="Фото користувача"
              className="w-full h-full object-cover"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
