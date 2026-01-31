import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./public/locales/en/common.json";
import uk from "./public/locales/uk/common.json";

export const i18nConfig = {
  locales: ["uk", "en"],
  defaultLocale: "uk", //мова за замовчуванням (тут англійська)
  resources: { en: { translation: en }, uk: { translation: uk } },
  fallbackLng: "en", //якщо переклад для вибраної мови не знайдено, використовується англійська.
  interpolation: {
    // Наприклад, якщо переклад містить <b>Іван</b>, воно буде відображено як жирний текст, а не як &lt;b&gt;Іван&lt;/b&gt;.
    escapeValue: false, //єкранування
  },
};


i18n.use(initReactI18next).init({
  resources: i18nConfig.resources,
  lng: i18nConfig.defaultLocale,
  fallbackLng: i18nConfig.fallbackLng,
  interpolation: i18nConfig.interpolation,
});



export default i18n;
