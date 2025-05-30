import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useSkillStore = create((set, get) => ({
  dataSkills: null,
  dataSkillById: null,
  dataSkillAll: null,
  loading: false,

  getDataSkills: async (id) => {
    const current = useSkillStore.getState().dataSkills;
    if (current && current.uuid === id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill/${id}`
      );

      set({ dataSkills: res.data.skills });
    } catch (err) {
      console.error("Error fetching skills:", err);
      set({ dataSkills: null });
    } finally {
    }
  },

  getDataSkillAll: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill`
      );

      set({ dataSkillAll: res.data.data });
    } catch (err) {
      console.error("Error fetching educations:", err);
      set({ dataSkillAll: null });
    } 
  },

  getSkillById: async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill/${id}`
      );

      set({ dataSkillById: res.data.skills });
      return res.data.skills;
    } catch (err) {
      console.error("Error fetching skill by ID:", err);
    } finally {
    }
  },

  updateSkillById: async (updatedData) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    const id = updatedData.uuid;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill`,
        updatedData
      );

      const current = get().dataSkills;
      if (current && current.uuid === id) {
        set({ dataSkills: res.data.skills });
      } else {
        set({ dataSkillById: res.data.skills });
      }

      return { ok: true };
    } catch (err) {
      console.error("Error updating skills:", err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  },

  clearSkills: () => set({ dataSkills: null }),
  clearSkillById: () => set({ dataSkillById: null }),
  clearSkillAll: () => set({ dataSkillAll: null }),
}));
