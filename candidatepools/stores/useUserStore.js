import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set) => ({
  dataUser: null,
  loading: false,

  getUser: async (id) => {
    const current = useUserStore.getState().dataUser;
    if (current) return;

    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );
      console.log("fetch");
      set({ dataUser: res.data.user });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ dataUser: null });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        updatedData
      );
      set({ dataUser: res.data.user }); 
      return { ok: true };
    } catch (err) {
      console.error("Error updating user:", err);
      return { ok: false };
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => set({ dataUser: null }),
}));
