import { create } from "zustand";
import type { EarthquakeProperties } from "../types/earthquake";

type SelectionState = {
  selected: EarthquakeProperties | null;
  setSelected: (s: EarthquakeProperties | null) => void;
  clear: () => void;
};

export const useSelectionStore = create<SelectionState>(() => ({
  selected: null,
  // will be overwritten by Zustand set internally; we keep signatures for consumers
  setSelected: () => {},
  clear: () => {},
}));

// patch methods using the actual store setter so consumers get working methods
useSelectionStore.setState({
  setSelected: (s: EarthquakeProperties | null) =>
    useSelectionStore.setState({ selected: s }),
  clear: () => useSelectionStore.setState({ selected: null }),
});

export default useSelectionStore;
