import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
interface SidebarItem {
  label: string;
  path: string;
}

interface SideBarAdminsProps {
  items: SidebarItem[]; 
  onClose: () => void; 
}

export default function SideBarAdmins({ items, onClose }: SideBarAdminsProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed top-0 left-0 w-64 h-full bg-linear-to-b from-[#64359A] to-[#534A79] text-gray-300 shadow-lg z-50">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <div className="w-full h-full  mr-5">
            <Link
              className="block w-full h-full text-base font-bold"
              href="/reception/main"
            >
              {t("reception.header_side.pages.menu")}
            </Link>
          </div>
          <button onClick={onClose} className="text-red-400">
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="hover:bg-purple-850 border border-gray-500 hover:border-gray-400 p-2 rounded cursor-pointer"
            >
              <Link className="block w-full h-full text-base" href={item.path}>
                {item.label}
              </Link>
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
