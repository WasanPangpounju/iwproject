import { create } from "zustand";
import axios from "axios";

export const useCredentialStore = create((set) => ({
  isLoading: false,
  error: null,
  message: "",

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: "" });

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
      set({ isLoading: false });
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/reset-password`, {
        token,
        newPassword,
      });

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
    }
  },
}));
