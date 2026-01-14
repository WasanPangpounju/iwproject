import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useUniversityStore = create((set, get) => ({
  universities: [],
  loading: false,
fetchUniversities: async () => {
  set({ loading: true });
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni`);

    // ✅ รองรับหลายรูปแบบ response
    const raw = res.data;
    const list =
      Array.isArray(raw) ? raw :
      Array.isArray(raw?.data) ? raw.data :
      Array.isArray(raw?.universities) ? raw.universities :
      Array.isArray(raw?.items) ? raw.items :
      [];

    set({ universities: list, loading: false });
  } catch (err) {
    console.error("fetchUniversities error:", err);
    set({ universities: [], loading: false });
  }
},

  // ดึงข้อมูลทั้งหมด
  // fetchUniversities: async () => {
  //       // กัน dev/StrictMode เรียกซ้ำแบบไม่จำเป็น (optional แต่ดีมาก)
  //   if (get().loading) return;

  //   set({ loading: true });
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/uni`
  //     );
  //     set({ universities: res.data ,
  //               loading: false,
  //     });
      
  //   } catch (err) {
  //           console.error("fetchUniversities error:", err);
  //     set({
  //       universities: [],
  //       loading: false, // ✅ ต้อง reset เสมอ
  //     });
  //   }
  // },

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
