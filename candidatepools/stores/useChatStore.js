import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

export const useChatStore = create((set) => ({
  chats: null,
  chatById: null,
  loading: false,
  error: null,

  // ดึงแชททั้งหมด
  fetchChats: async () => {

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`
      );
      set({ chats: res.data.chats });
    } catch (error) {
      console.error("Error fetching all chats:", error);
      set({ chats: null, error });
    } finally {
    }
  },

  // ดึงแชทตาม userId
  fetchChatById: async (userId) => {
    const setLoading = useAppStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${userId}`
      );
      set({ chatById: res.data.chats });
      return { ok: true, data: res.data.chats };
    } catch (error) {
      console.error("Error fetching chat by ID:", error);
      set({ chatById: null, error });
    } finally {
      setLoading(false);
    }
  },

  // ส่งข้อความเข้าแชท
  sendMessage: async ({
    userId,
    message,
    senderRole,
    statusRead,
    statusReadAdmin,
    file
  }) => {
    // const setLoading = useAppStore.getState().setLoading;
    // setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
        {
          userId,
          message,
          senderRole,
          statusRead,
          statusReadAdmin,
          file
        }
      );
      return { ok: true, data: res.data.data };
    } catch (error) {
      console.error("Error sending message:", error);
      return { ok: false, error };
    } finally {
      // setLoading(false);
    }
  },

  updateStatusRead: async ({ userId, statusRead, statusReadAdmin }) => {
    // const setLoading = useAppStore.getState().setLoading;
    // setLoading(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${userId}`,
        {
          statusRead,
          statusReadAdmin,
        }
      );

      return { ok: true, data: res.data.data };
    } catch (error) {
      console.error("Error updating read status:", error);
      set({ error });
      return { ok: false, error };
    } finally {
      // setLoading(false);
    }
  },

  clearChat: () => set({ chatById: null }),
  clearAllChats: () => set({ chats: null }),
}));
