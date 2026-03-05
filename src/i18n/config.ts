import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/i18n/locales/en.json";
import ja from "@/i18n/locales/ja.json";

const resources = {
  ja: { translation: ja },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ja", // デフォルト言語
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
