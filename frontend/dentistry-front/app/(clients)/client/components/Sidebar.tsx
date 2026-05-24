import Link from "next/link";
import { useTranslation } from "react-i18next";

interface SidebarItem {
  label: string;
  path: string;
}

interface SideBarAdminsProps {
  items: SidebarItem[];
  headerLinks?: SidebarItem[];
  onClose: () => void;
}

export default function SideBarAdmins({
  items,
  headerLinks = [],
  onClose,
}: SideBarAdminsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Сайдбар */}
      <div className="fixed top-0 left-0 w-72 h-full bg-white text-gray-900 shadow-2xl z-10 rounded-r-3xl border-r-4 border-yellow-500">
        {/* Верхній блок */}
        <div className="p-4 flex justify-between items-center border-b-2 border-yellow-500">
          <div className="w-full h-full mr-5">
            <Link
              className="block w-full h-full text-lg font-bold text-yellow-600"
              href="/client/main"
            >
              {t("client.header.pages.main")}
            </Link>
          </div>
          <button
            onClick={onClose}
            className="text-gray-900 font-bold hover:text-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Навігаційні посилання з header (тільки на мобільних) */}
        <ul className="p-6 space-y-4 block md:hidden border-b border-gray-300">
          {headerLinks.map((link, idx) => (
            <li
              key={idx}
              className="border border-yellow-400 hover:bg-yellow-200 active:bg-yellow-400 p-3 rounded-lg cursor-pointer transition-colors"
            >
              <Link
                className="block w-full h-full text-base font-medium text-gray-800"
                href={link.path}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Пункти меню */}
        <ul className="p-6 space-y-4">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="hover:bg-yellow-400 active:bg-yellow-600 border border-yellow-400 p-3 rounded-xl cursor-pointer transition-colors"
            >
              <Link
                className="block w-full h-full text-base font-medium text-gray-800"
                href={item.path}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Напівпрозорий фон */}

      <div
        onClick={onClose}
        className="fixed inset-0 backdrop-brightness-50 z-0"
      ></div>
    </>
  );
}
