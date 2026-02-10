import { create } from "zustand";
import axios from "axios";

// ดึงจาก .env (อย่าลืมเพิ่มใน .env.local)
const PAGE_ID = process.env.NEXT_PUBLIC_PAGEID_FACEBOOK;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN_FACEBOOK;

const useAppStore = create((set) => ({
  isLoading: false,
  posts: null,
  error: null,

  setLoading: (value) => set({ isLoading: value }),

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v19.0/${PAGE_ID}/posts`,
        {
          params: {
            limit: 3,
            access_token: ACCESS_TOKEN,
            fields: "message,created_time,full_picture",
          },
        }
      );
      set({ posts: res.data.data });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ posts: null, error });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAppStore;