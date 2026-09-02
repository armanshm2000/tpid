import en from "@/../public/locales/en/common.json";
import fa from "@/../public/locales/fa/common.json";

export type Locale = "en" | "fa";

const translations: Record<Locale, Record<string, string>> = { en, fa };

let currentLocale: Locale = "en";

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const value = translations[currentLocale]?.[key] ?? translations.en[key] ?? key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}

export function getDirection(): "ltr" | "rtl" {
  return currentLocale === "fa" ? "rtl" : "ltr";
}

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.en;
}
