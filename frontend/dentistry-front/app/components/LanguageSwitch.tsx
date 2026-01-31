// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// export default function LanguageSwitch() {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleDropdown = () => setIsOpen((prev) => !prev);

//   const { i18n } = useTranslation();
//   const availableLanguages = Object.keys(i18n.options.resources!);

//   const changeLanguage = (lng: string) => {
//     i18n.changeLanguage(lng);

//     localStorage.setItem("language", lng);
//     setIsOpen(false);
//   };

//   useEffect(() => {
//     const savedLang = localStorage.getItem("language");
//     if (savedLang) {
//       i18n.changeLanguage(savedLang);
//     }
//   }, [i18n.language]);

//   return (
//     <>
//       <div className="relative inline-block text-left">
//         {/* Кнопка перемикання мови */}
//         <button
//           onClick={toggleDropdown}
//           className=" flex items-center justify-center rounded-md bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 "
//           type="button"
//           aria-haspopup="true"
//           aria-expanded={isOpen}
//         >
//           {i18n.language?.toUpperCase()}
//         </button>

//         {/* Випадаюче меню */}
//         {isOpen && (
//           <div className="absolute z-10 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-gray-300">
//             <ul className="py-1">
//               {availableLanguages.map((lng) => (
//                 <li key={lng}>
//                   <button
//                     onClick={() => changeLanguage(lng)}
//                     className={`w-full px-3 py-2 text-sm text-left transition duration-150 ${
//                       i18n.language === lng
//                         ? "bg-yellow-100 text-yellow-700 font-bold cursor-default"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {lng.toUpperCase()}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageSwitchProps {
  buttonClassName?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

export default function LanguageSwitch({
  buttonClassName = "flex items-center justify-center rounded-md bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 px-3 py-2",
  dropdownClassName = "absolute z-10 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-gray-300",
  itemClassName = "w-full px-3 py-2 text-sm text-left transition duration-150 text-gray-700 hover:bg-gray-100",
  activeItemClassName = "bg-yellow-100 text-yellow-700 font-bold cursor-default",
}: LanguageSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const { i18n } = useTranslation();
  const availableLanguages = Object.keys(i18n.options.resources!);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n.language]);

  return (
    <div className="relative inline-block text-left">
      {/* Кнопка перемикання мови */}
      <button
        onClick={toggleDropdown}
        className={buttonClassName}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {i18n.language?.toUpperCase()}
      </button>

      {/* Випадаюче меню */}
      {isOpen && (
        <div className={dropdownClassName}>
          <ul className="py-1">
            {availableLanguages.map((lng) => (
              <li key={lng}>
                <button
                  onClick={() => changeLanguage(lng)}
                  className={
                    i18n.language === lng
                      ? `${itemClassName} ${activeItemClassName}`
                      : itemClassName
                  }
                >
                  {lng.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
