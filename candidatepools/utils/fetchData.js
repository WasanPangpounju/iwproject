import { useUniversityStore } from "@/stores/useUniversityStore";

// ฟังก์ชันดึงข้อมูลพื้นฐาน เช่น มหาวิทยาลัย
export const fetchInitialData = async () => {
  const { fetchUniversities } = useUniversityStore.getState();

  try {
    await Promise.all([
      fetchUniversities(),
    ]);
  } catch (err) {
    console.error("Error fetching initial data:", err);
  }
};
