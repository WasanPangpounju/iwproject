import { create } from "zustand";
import axios from "axios";

export const useEducationStore = create((set, get) => ({
  dataEducations: null, //my users
  loading: false,

  getEducationById: async (id) => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${id}`
      );

      set({ dataEducations: res.data.educations });
      return res.data.educations;
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateEducationById: async (updatedData) => {
    set({ loading: true });

    const id = updatedData.uuid;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`,
        updatedData
      );

      const current = get().dataEducations;
      if (current && current.uuid === id) {
        set({ dataEducations: res.data.educations });
      }

      return { ok: true };
    } catch (err) {
      console.error("Error updating education:", err);
      return { ok: false, error: err };
    } finally {
      set({ loading: false });
    }
  },

  updateFileName: async ({ id, oldName, newName }) => {
    set({ loading: true });

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${id}/files`,
        {
          oldName,
          newName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const current = get().dataEducations;
      if (current && Array.isArray(current.files)) {
        const updatedFiles = current.files.map((file) =>
          file.name === oldName ? { ...file, name: newName } : file
        );

        set({
          dataEducations: {
            ...current,
            files: updatedFiles,
          },
        });
      }

      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error updating file name:", err);
      return { ok: false, error: err };
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => set({ dataEducations: null }),
}));
