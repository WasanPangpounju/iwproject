import { create } from "zustand";
import axios from "axios";

export const useHistoryWorkStore = create((set, get) => ({
  dataHistoryWork: null, //my users
  dataHistoryWorkById: null, //my users
  loading: false,

  getDataHistoryWork: async (id) => {
    const current = useHistoryWorkStore.getState().dataHistoryWork;
    if (current && current.uuid === id) return;

    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`
      );

      set({ dataHistoryWork: res.data.historyWork });
    } catch (err) {
      console.error("Error fetching historyWork:", err);
      set({ dataHistoryWork: null });
    } finally {
      set({ loading: false });
    }
  },

  getHistoryWorkById: async (id) => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`
      );

      set({ dataHistoryWorkById: res.data.historyWork });
      return res.data.historyWork;
    } catch (err) {
      console.error("Error fetching historyWork by ID:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateHistoryWorkById: async (updatedData) => {
    set({ loading: true });

    const id = updatedData.uuid;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork`,
        updatedData
      );

      const current = get().dataHistoryWork;
      if (current && current.uuid === id) {
        set({ dataHistoryWork: res.data.historyWork });
      } else {
        set({ dataHistoryWorkById: res.data.historyWork });
      }

      return { ok: true };
    } catch (err) {
      console.error("Error updating historyWork:", err);
      return { ok: false, error: err };
    } finally {
      set({ loading: false });
    }
  },

  clearHistoryWork: () => set({ dataHistoryWork: null }),
  clearHistoryWorkById: () => set({ dataHistoryWorkById: null }),
}));
