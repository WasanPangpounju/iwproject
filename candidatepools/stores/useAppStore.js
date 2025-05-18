import { create } from "zustand";

const useAppStore = create((set) => ({
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));
export default useAppStore;
