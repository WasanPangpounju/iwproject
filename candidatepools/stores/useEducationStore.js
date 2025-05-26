import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useEducationStore = create((set, get) => ({
  dataEducations: null, //my users
  dataEducationById: null, //my users
  dataEducationAll: null, //my users
  loading: false,

  getEducation: async (id) => {
    const current = useEducationStore.getState().dataEducations;
    if (current && current.uuid === id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${id}`
      );

      set({ dataEducations: res.data.educations });
    } catch (err) {
      console.error("Error fetching educations:", err);
      set({ dataEducations: null });
    } finally {
    }
  },

  getEducationAll: async () => {

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`
      );

      set({ dataEducationAll: res.data.educations });
    } catch (err) {
      console.error("Error fetching educations:", err);
      set({ dataEducationAll: null });
    } finally {
    }
  },

  getEducationById: async (id) => {

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${id}`
      );

      set({ dataEducationById: res.data.educations });
      return res.data.educations;
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
    }
  },

  updateEducationById: async (updatedData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    const id = updatedData.uuid;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`,
        updatedData
      );

      const current = get().dataEducations;
      if (current && current.uuid === id) {
        set({ dataEducations: res.data.educations });
      } else {
        set({ dataEducationById: res.data.educations });
      }

      return { ok: true };
    } catch (err) {
      console.error("Error updating education:", err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  },

  updateFileName: async ({ id, oldName, newName }) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

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
      setLoading(false);
    }
  },

  clearEducations: () => set({ dataEducations: null }),
  clearEducationAll: () => set({ dataEducationAll: null }),
  clearEducationById: () => set({ dataEducationById: null }),
}));
