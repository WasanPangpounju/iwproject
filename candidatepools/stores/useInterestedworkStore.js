import { create } from "zustand";
import axios from "axios";

export const useInterestedWorkStore = create((set, get) => ({
  dataWorks: null,
  dataWorkById: null,
  loading: false,

  getDataInterestedWork: async (id) => {
    const current = get().dataWorks;
    if (current && current.uuid === id) return;

    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork/${id}`
      );

      set({ dataWorks: res.data.interestedWork });
    } catch (err) {
      console.error("Error fetching interestedWork:", err);
      set({ dataWorks: null });
    } finally {
      set({ loading: false });
    }
  },

  getInterestedWorkById: async (id) => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork/${id}`
      );

      set({ dataWorkById: res.data.interestedWork });
      return res.data.interestedWork;
    } catch (err) {
      console.error("Error fetching interestedwork by ID:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateInterestedWorkById: async (updatedData) => {
    set({ loading: true });

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
      set({ loading: false });
    }
  },

  clearInterestedWork: () => set({ dataWorks: null }),
  clearInterestedWorkById: () => set({ dataWorkById: null }),
}));
