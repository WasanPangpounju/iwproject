import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useHistoryWorkStore = create((set, get) => ({
  dataHistoryWork: null,
  dataHistoryWorkById: null,
  dataHistoryWorkAll: null,
  loading: false,

  getDataHistoryWork: async (id) => {
    const current = useHistoryWorkStore.getState().dataHistoryWork;
    if (current && current.uuid === id) return;

    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`
      );

      set({ dataHistoryWork: res.data.historyWork });
    } catch (err) {
      console.error("Error fetching historyWork:", err);
      set({ dataHistoryWork: null });
    } finally {
      setLoading(false);
    }
  },

  getDataHistoryWorkAll: async () => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork`
      );

      set({ dataHistoryWorkAll: res.data.data });
    } catch (err) {
      console.error("Error fetching historyWork:", err);
      set({ dataHistoryWorkAll: null });
    } finally {
      setLoading(false);
    }
  },

  getHistoryWorkById: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`
      );

      set({ dataHistoryWorkById: res.data.historyWork });
      return res.data.historyWork;
    } catch (err) {
      console.error("Error fetching historyWork by ID:", err);
    } finally {
      setLoading(false);
    }
  },

  updateHistoryWorkById: async (updatedData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

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
      setLoading(false);
    }
  },

  clearHistoryWork: () => set({ dataHistoryWork: null }),
  clearHistoryWorkAll: () => set({ dataHistoryWorkAll: null }),
  clearHistoryWorkById: () => set({ dataHistoryWorkById: null }),
}));
