import { create } from "zustand";
import axios from "axios";

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
      // 1) Admin announcements
      const adminPromise = axios.get("/api/announcements");

      // 2) Facebook posts (อย่าให้พังทั้งหน้า ถ้า FB fail)
      const fbPromise = axios.get(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts`, {
        params: {
          limit: 3,
          access_token: ACCESS_TOKEN,
          fields: "message,created_time,full_picture",
        },
      });

      const [adminRes, fbRes] = await Promise.allSettled([adminPromise, fbPromise]);

      const adminItems =
        adminRes.status === "fulfilled" ? adminRes.value.data.items || [] : [];

      const fbItems =
        fbRes.status === "fulfilled" ? fbRes.value.data.data || [] : [];

      // ✅ map admin ให้พร้อมใช้ในหน้าแรก
      const adminPosts = adminItems.map((a) => ({
        id: `admin-${a._id}`,
        isAdmin: true,
        pinned: !!a.pinned,

        title: a.title || "",
        description: a.description || "",
        content: a.content || "",

        created_time: a.publishedAt || a.createdAt,
        full_picture: a.imageUrl || null,

        linkUrl: a.linkUrl || "",
        linkText: a.linkText || "",
      }));

      // ✅ map facebook
      const facebookPosts = fbItems.map((p) => ({
        ...p,
        isAdmin: false,
      }));

      // ✅ sort admin: pinned ก่อน แล้วค่อยใหม่→เก่า
      adminPosts.sort((x, y) => {
        if (x.pinned !== y.pinned) return x.pinned ? -1 : 1;
        return new Date(y.created_time).getTime() - new Date(x.created_time).getTime();
      });

      // ⭐ merge: admin ก่อนเสมอ
      set({ posts: [...adminPosts, ...facebookPosts] });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ posts: null, error });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAppStore;
