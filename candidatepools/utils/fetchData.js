import useAppStore from "@/stores/useAppStore";
import { useUniversityStore } from "@/stores/useUniversityStore";

// ฟังก์ชันดึงข้อมูลพื้นฐาน เช่น มหาวิทยาลัย
export const fetchInitialData = async () => {
  const { fetchUniversities } = useUniversityStore.getState();
  const { fetchPosts } = useAppStore.getState()

  try {
    await Promise.all([
      fetchUniversities(),
      fetchPosts(),
    ]);
  } catch (err) {
    console.error("Error fetching initial data:", err);
  }
};
