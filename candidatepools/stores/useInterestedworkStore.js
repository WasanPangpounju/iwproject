import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useInterestedWorkStore = create((set, get) => ({
  dataWorks: null,
  dataWorkById: null,
  dataWorkAll: null,
  loading: false,

  getDataInterestedWork: async (id) => {
    const current = get().dataWorks;
    if (current && current.uuid === id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork/${id}`
      );

      set({ dataWorks: res.data.interestedWork });
    } catch (err) {
      console.error("Error fetching interestedWork:", err);
      set({ dataWorks: null });
    } finally {
    }
  },

  getDataInterestedWorkAll: async () => {

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork`
      );

      set({ dataWorkAll: res.data.interestedWork });
    } catch (err) {
      console.error("Error fetching interestedWork:", err);
      set({ dataWorkAll: null });
    } finally {
    }
  },

  getInterestedWorkById: async (id) => {
  
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork/${id}`
      );

      set({ dataWorkById: res.data.interestedWork });
      return res.data.interestedWork;
    } catch (err) {
      console.error("Error fetching interestedwork by ID:", err);
    } finally {
    }
  },

  updateInterestedWorkById: async (updatedData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    const id = updatedData.uuid;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork`,
        updatedData
      );

      const current = get().dataWorks;
      if (current && current.uuid === id) {
        set({ dataWorks: res.data.interestedWork });
      } else {
        set({ dataWorkById: res.data.interestedWork });
      }

      return { ok: true };
    } catch (err) {
      console.error("Error updating interestedWork:", err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  },

  clearInterestedWork: () => set({ dataWorks: null }),
  clearInterestedWorkAll: () => set({ dataWorkAll: null }),
  clearInterestedWorkById: () => set({ dataWorkById: null }),
}));
