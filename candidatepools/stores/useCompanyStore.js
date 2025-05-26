import { create } from "zustand";
import useAppStore from "./useAppStore";

export const useCompanyStore = create((set, get) => ({
  companies: null,
  companyById: null,
  loading: false,
  error: null,

  fetchCompanies: async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data = await res.json();
      set({ companies: data.companys, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    } finally {
    }
  },

  fetchCompanyById: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch company");
      const data = await res.json();
      set({ companyById: data.company, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    } finally {
      setLoading(false);
    }
  },

  createCompany: async (body) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Failed to create company");
      await get().fetchCompanies();
      return { ok: true };
    } catch (err) {
      set({ error: err.message });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  updateCompany: async (id, body) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Failed to update company");
      await get().fetchCompanies();
      return { ok: true };
    } catch (err) {
      set({ error: err.message });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  deleteCompany: async (id) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company/${id}`,
        {
          method: "DELETE",
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to delete company");
      await get().fetchCompanies();
      return { ok: true };
    } catch (err) {
      set({ error: err.message });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  clearError: () => set({ error: null }),
  clearCompany: () => set({ companies: null }),
  clearCompanyById: () => set({ companyById: null }),
}));
