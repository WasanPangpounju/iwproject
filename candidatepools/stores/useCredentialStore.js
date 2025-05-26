import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";
export const useCredentialStore = create((set) => ({
  isLoading: false,
  error: null,
  message: "",

  forgotPassword: async (email) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { ok: true, data: res };
    } catch (err) {
      console.log(err);

      return { ok: false };
    } finally {
      setLoading(false);
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/reset-password`,
        {
          token,
          newPassword,
        }
      );

      return { ok: true, data: response.data };
    } catch (error) {
      console.error(
        "Reset password error:",
        error?.response?.data || error.message
      );
      return {
        ok: false,
        error: error?.response?.data?.message || "เกิดข้อผิดพลาดบางอย่าง",
      };
    } finally {
      setLoading(false);
    }
  },
}));
