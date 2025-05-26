import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useSystemLogStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,

  // ✅ ดึง log ทั้งหมด
  getLogs: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systemLog`
      );
      set({ logs: res.data.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
   
    }
  },

  // ✅ เพิ่ม log ใหม่
  addLog: async (logData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systemLog`,
        logData
      );
      set((state) => ({
        logs: [res.data.data, ...state.logs],
      }));
    } catch (err) {
      set({ error: err.message });
    } finally {
      setLoading(false);
    }
  },
  clearSystemLogs: () => set({ logs: null }),
}));
