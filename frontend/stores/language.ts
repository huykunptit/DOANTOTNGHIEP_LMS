import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "vi" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "vi",
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set({ language: get().language === "vi" ? "en" : "vi" }),
    }),
    { name: "language-storage" }
  )
);
