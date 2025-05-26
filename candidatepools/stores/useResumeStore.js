import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useResumeStore = create((set, get) => ({
  resumeFiles: [],
  loading: false,
  error: null,

  // ดึงรายการไฟล์จาก uuid
  fetchResumeFiles: async (uuid) => {
    try {
      const setLoading = useAppStore.getState().setLoading;
      setLoading(true);

      const res = await axios.get(`/api/resume/file?uuid=${uuid}`);
      set({ resumeFiles: res.data.files, loading: false });

      return { ok: true, data: res.data.files };
    } catch (err) {
      console.error("Fetch error:", err);
      set({ loading: false, error: "ไม่สามารถโหลดข้อมูลได้" });
      return { ok: false, error: "ไม่สามารถโหลดข้อมูลได้" };
    } finally {
      setLoading(false);
    }
  },

  // อัปโหลดไฟล์เข้า resume
  uploadResumeFile: async ({ uuid, file }) => {
    try {
      const setLoading = useAppStore.getState().setLoading;
      setLoading(true);

      const res = await axios.post("/api/resume/file", {
        uuid,
        file,
      });

      const currentFiles = get().resumeFiles || [];
      set({
        resumeFiles: [...currentFiles, file],
      });

      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: "อัปโหลดไฟล์ล้มเหลว" };
    } finally {
      setLoading(false);
    }
  },

  // เปลี่ยนชื่อไฟล์
  updateFileName: async ({ uuid, fileUrl, newFileName }) => {
    try {
      const setLoading = useAppStore.getState().setLoading;
      setLoading(true);

      const res = await axios.patch("/api/resume/file", {
        uuid,
        fileUrl,
        newFileName,
      });

      // อัปเดต state
      set((state) => ({
        resumeFiles: state.resumeFiles.map((file) =>
          file.fileUrl === fileUrl ? { ...file, fileName: newFileName } : file
        ),
        loading: false,
      }));

      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: "เปลี่ยนชื่อไฟล์ล้มเหลว" };
    } finally {
      setLoading(false);
    }
  },

  // ลบไฟล์
  deleteResumeFile: async ({ uuid, fileUrl }) => {
    try {
      const setLoading = useAppStore.getState().setLoading;
      setLoading(true);

      const res = await axios.delete("/api/resume/file", {
        data: { uuid, fileUrl },
      });

      return { ok: true };
    } catch (err) {
      console.error("Delete error:", err);
      set({ loading: false, error: "ลบไฟล์ไม่สำเร็จ" });
      return { ok: false, error: "ลบไฟล์ไม่สำเร็จ" };
    } finally {
      setLoading(false);
    }
  },
  clearResumeFiles: () => set({ resumeFiles: null }),
}));
