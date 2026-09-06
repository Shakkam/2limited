"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SUPPORTED = ["fr", "en"];
const DEFAULT_LANG = "en";
const STORAGE_KEY = "2limited:lang";

/**
 * Resolve a possibly-bilingual value.
 * - `{ fr: "…", en: "…" }` → the string for `lang` (falling back to the other)
 * - a plain string (proper nouns, emails, song titles…) passes through untouched
 * - an array maps element-wise, so `bio: [{fr,en}, {fr,en}]` works too
 */
export function pick(value, lang) {
  if (Array.isArray(value)) return value.map((item) => pick(item, lang));
  if (value && typeof value === "object") {
    if ("fr" in value || "en" in value) return value[lang] ?? value.en ?? value.fr ?? "";
    return value;
  }
  return value;
}

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (value) => pick(value, DEFAULT_LANG),
});

export function LanguageProvider({ children }) {
  // Server renders the default; the browser's real preference is applied on
  // mount (a stored choice always wins over the browser's own language).
  // Reading navigator/localStorage during render would break hydration.
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // private mode / storage blocked — fall through to the browser language
    }
    if (SUPPORTED.includes(stored)) {
      setLangState(stored);
      return;
    }
    const browser = navigator.language || navigator.userLanguage || "";
    setLangState(browser.toLowerCase().startsWith("fr") ? "fr" : "en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!SUPPORTED.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // choice just won't persist across reloads
    }
  }, []);

  const t = useCallback((value) => pick(value, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
