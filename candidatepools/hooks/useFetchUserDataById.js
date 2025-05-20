import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useResumeStore } from "@/stores/useResumeStore";

// ✅ ฟังก์ชันล้างข้อมูลทั้งหมด
const clearUserDataById = () => {
  useUserStore.getState().clearUserById();
  useEducationStore.getState().clearEducationById();
  useHistoryWorkStore.getState().clearHistoryWorkById();
  useSkillStore.getState().clearSkillById();
  useInterestedWorkStore.getState().clearInterestedWorkById();
  useResumeStore.getState().clearResumeFiles();
};

export const useFetchUserDataById = (id) => {
  const { getUserById } = useUserStore();
  const { getEducationById } = useEducationStore();
  const { getHistoryWorkById } = useHistoryWorkStore();
  const { getSkillById } = useSkillStore();
  const { getInterestedWorkById } = useInterestedWorkStore();
  const { fetchResumeFiles } = useResumeStore();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      await Promise.all([
        getUserById(id),
        getEducationById(id),
        getHistoryWorkById(id),
        getSkillById(id),
        getInterestedWorkById(id),
        fetchResumeFiles(id)
      ]);
    };

    fetchAll();

    // ✅ ล้างข้อมูลเมื่อออกจากหน้า
    return () => {
      clearUserDataById();
    };
  }, [id]);
};
