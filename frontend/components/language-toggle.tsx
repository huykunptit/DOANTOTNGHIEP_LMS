"use client";

import { useLanguageStore } from "@/stores/language";

export function LanguageToggle() {
  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
      aria-label="Change language"
    >
      {language === "vi" ? "VI / EN" : "EN / VI"}
    </button>
  );
}
