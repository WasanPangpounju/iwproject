import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useUserStore = create((set, get) => ({
  dataUser: null,
  dataStudents: null,
  dataAdmin: null,
  dataUserAll: null,
  dataUserById: null,
  loading: false,

  getUserById: async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );

      set({ dataUserById: res.data.user });
      return res.data.user;
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      
    }
  },

  deleteUserById: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );

      if (res.status === 200) {
        await get().getUserAll();
        return { ok: true, message: res.data.message };
      } else {
        return {
          ok: false,
          message: res.data.error || "Failed to delete user",
        };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        ok: false,
        message: error.response?.data?.error || "Server error",
      };
    } finally {
      setLoading(false);
    }
  },

  getUser: async (id) => {
    const current = useUserStore.getState().dataUser;
    if (current && current.uuid === id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`
      );

      set({ dataUser: res.data.user });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ dataUser: null });
    } finally {
     
    }
  },

  getUserAll: async () => {
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
   
    }
  },

  updateUserById: async (id, updatedData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
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
      setLoading(false);
    }
  },

  createUser: async (bodyData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user`,
        bodyData
      );
      return { ok: true };
    } catch (err) {
      console.error("Error updating user:", err);
      return { ok: false };
    } finally {
      setLoading(false);
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

  checkUserExists: async ({ user, email }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkUser`,
        {
          user,
          email,
        }
      );

      const { user: userExists, email: emailExists } = res.data;
      return { userExists, emailExists };
    } catch (error) {
      console.error("Error checking user:", error);
      throw new Error("Error fetch api checkUser");
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
