/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { EarthquakeProperties } from "../types/earthquake";
import useSelectionStore from "../stores/selectionStore";

type SelectedContextValue = {
  selected: EarthquakeProperties | null;
  setSelected: (s: EarthquakeProperties | null) => void;
  clearSelected: () => void;
};

const SelectedContext = createContext<SelectedContextValue | undefined>(
  undefined
);

export function SelectedProvider({ children }: { children: ReactNode }) {
  const selected = useSelectionStore((s) => s.selected);
  const setSelected = useSelectionStore((s) => s.setSelected);
  const clear = useSelectionStore((s) => s.clear);

  const value = useMemo(
    () => ({ selected, setSelected, clearSelected: clear }),
    [selected, setSelected, clear]
  );

  return (
    <SelectedContext.Provider value={value}>
      {children}
    </SelectedContext.Provider>
  );
}

export function useSelectedContext() {
  const ctx = useContext(SelectedContext);
  if (!ctx)
    throw new Error("useSelectedContext must be used within SelectedProvider");
  return ctx;
}
