import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set, get) => ({
  dataUser: null,
  dataStudents: null,
  dataAdmin: null,
  dataUserAll: null,
  dataUserById: null,
  loading: false,

  getUserById: async (id) => {
    //for user id use some component
    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );

      set({ dataUserById: res.data.user });
      return res.data.user;
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      set({ loading: false });
    }
  },

  getUser: async (id) => {
    const current = useUserStore.getState().dataUser;
    if (current && current.uuid === id) return;

    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );

      set({ dataUser: res.data.user });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ dataUser: null });
    } finally {
      set({ loading: false });
    }
  },

  getUserAll: async () => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/students`
      );

      const users = res.data.user || [];

      // แยกตาม role
      const dataStudents = users.filter((user) => user.role === "user");
      const dataAdmin = users.filter((user) => user.role === "admin");
      const dataUserAll = users; // รวมทั้งหมด

      set({
        dataStudents,
        dataAdmin,
        dataUserAll,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({
        dataStudents: [],
        dataAdmin: [],
        dataUserAll: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  updateUserById: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        updatedData
      );

      // ถ้าอัปเดต user ที่ล็อกอินอยู่
      const currentUser = get().dataUser;
      if (currentUser && currentUser.uuid === id) {
        set({ dataUser: res.data.user });
      } else {
        set({ dataUserById: res.data.user });
      }

      return { ok: true, user: res.data.user };
    } catch (err) {
      console.error("Error updating user:", err);
      return { ok: false };
    } finally {
      set({ loading: false });
    }
  },
  checkIdExists: async (idCard, idCardDisabled) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idCard, idCardDisabled }),
        }
      );

      if (!res.ok) {
        throw new Error("Error checking ID");
      }

      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  clearUserAll: () =>
    set({
      dataUserAll: null,
      dataStudents: null,
      dataAdmin: null,
    }),
  clearUser: () => set({ dataUser: null }),
  clearUserById: () => set({ dataUserById: null }),
}));
