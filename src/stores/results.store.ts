import { ResultResponse } from "@/types/results.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  results: ResultResponse | null;
  setResults: (results: ResultResponse | null) => void;
};

export const useResultsStore = create(
  persist(
    (set) => ({
      results: null,
      setResults: (results: ResultResponse | null) => set({ results }),
    }),
    {
      name: "results-storage",
      partialize: (state: AuthState) => ({
        results: state.results,
      }),
    }
  )
);
