import { create } from "zustand";
import axios from "axios";

export const useResumeStore = create((set, get) => ({
  resumeFiles: [],
  loading: false,
  error: null,

  // ดึงรายการไฟล์จาก uuid
  fetchResumeFiles: async (uuid) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`/api/resume/file?uuid=${uuid}`);
      set({ resumeFiles: res.data.files, loading: false });

      return { ok: true, data: res.data.files };
    } catch (err) {
      console.error("Fetch error:", err);
      set({ loading: false, error: "ไม่สามารถโหลดข้อมูลได้" });
      return { ok: false, error: "ไม่สามารถโหลดข้อมูลได้" };
    }
  },

  // อัปโหลดไฟล์เข้า resume
  uploadResumeFile: async ({ uuid, file }) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post("/api/resume/file", {
        uuid,
        file,
      });

      console.log("uuid: ", uuid)
      const currentFiles = get().resumeFiles || [];
      set({
        resumeFiles: [...currentFiles, file],
      });

      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Upload error:", err);
      set({ loading: false, error: "อัปโหลดไฟล์ล้มเหลว" });
      return { ok: false, error: "อัปโหลดไฟล์ล้มเหลว" };
    }
  },

  // เปลี่ยนชื่อไฟล์
  updateFileName: async ({ uuid, fileUrl, newFileName }) => {
    try {
      set({ loading: true, error: null });

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
      console.error("Rename error:", err);
      set({ loading: false, error: "เปลี่ยนชื่อไฟล์ล้มเหลว" });
      return { ok: false, error: "เปลี่ยนชื่อไฟล์ล้มเหลว" };
    }
  },

  // ลบไฟล์
  deleteResumeFile: async ({ uuid, fileUrl }) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.delete("/api/resume/file", {
        data: { uuid, fileUrl },
      });
      
      return { ok: true };
    } catch (err) {
      console.error("Delete error:", err);
      set({ loading: false, error: "ลบไฟล์ไม่สำเร็จ" });
      return { ok: false, error: "ลบไฟล์ไม่สำเร็จ" };
    }
  },
  clearResumeFiles: () => set({ resumeFiles: null }),
}));
