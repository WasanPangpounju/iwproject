import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useUniversityStore = create((set, get) => ({
  universities: null,
  loading: false,

  // ดึงข้อมูลทั้งหมด
  fetchUniversities: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni`
      );
      set({ universities: res.data });
    } catch (err) {}
  },

  // เพิ่มมหาวิทยาลัย
  addUniversity: async (universityName) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni`,
        { university: universityName }
      );
      get().fetchUniversities(); // รีโหลดข้อมูลใหม่
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  },

  // อัปเดตมหาวิทยาลัย
  updateUniversity: async (id, universityName) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni/${id}`, {
        university: universityName,
      });
      get().fetchUniversities();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  },

  // ลบมหาวิทยาลัย
  deleteUniversity: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni/${id}`
      );
      get().fetchUniversities();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  },
}));

export default useUniversityStore;
