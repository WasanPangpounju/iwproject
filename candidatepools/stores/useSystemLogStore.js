import { create } from "zustand";
import axios from "axios";

export const useSystemLogStore = create((set) => ({
  logs: [],
  loading: false,
  error: null,

  // ✅ ดึง log ทั้งหมด
  getLogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systemLog`
      );
      set({ logs: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ✅ เพิ่ม log ใหม่
  addLog: async (logData) => {
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
    }
  },
  clearSystemLogs: () => set({ logs: null }),
}));
