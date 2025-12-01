import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "@/i18n/locales/en";
import { ja } from "@/i18n/locales/ja";

const resources = {
  ja,
  en,
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
