import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

const apiBase = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export const useAnnouncementStore = create((set, get) => ({
  announcements: null,
  loading: false,
  error: null,

  fetchAnnouncements: async () => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${apiBase}/api/admin/announcements`, {
        headers: { "Content-Type": "application/json" },
      });
      set({ announcements: res.data.items || [], loading: false });
      return { ok: true };
    } catch (err) {
      set({ error: err?.message || "fetchAnnouncements error", loading: false });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  addAnnouncement: async (body) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      await axios.post(`${apiBase}/api/admin/announcements`, body, {
        headers: { "Content-Type": "application/json" },
      });
      await get().fetchAnnouncements();
      return { ok: true };
    } catch (err) {
      set({ error: err?.message || "addAnnouncement error" });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  updateAnnouncement: async (id, body) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      await axios.put(`${apiBase}/api/admin/announcements/${id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      await get().fetchAnnouncements();
      return { ok: true };
    } catch (err) {
      set({ error: err?.message || "updateAnnouncement error" });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  deleteAnnouncement: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      await axios.delete(`${apiBase}/api/admin/announcements/${id}`);
      await get().fetchAnnouncements();
      return { ok: true };
    } catch (err) {
      set({ error: err?.message || "deleteAnnouncement error" });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAnnouncementStore;
