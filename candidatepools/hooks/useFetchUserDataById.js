import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import useAppStore from "@/stores/useAppStore";

// ✅ ฟังก์ชันล้างข้อมูลทั้งหมด
const clearUserDataById = () => {
  useUserStore.getState().clearUserById();
  useEducationStore.getState().clearEducationById();
  useHistoryWorkStore.getState().clearHistoryWorkById();
  useSkillStore.getState().clearSkillById();
  useInterestedWorkStore.getState().clearInterestedWorkById();
};

export const useFetchUserDataById = (id) => {
  const { getUserById } = useUserStore();
  const { getEducationById } = useEducationStore();
  const { getHistoryWorkById } = useHistoryWorkStore();
  const { getSkillById } = useSkillStore();
  const { getInterestedWorkById } = useInterestedWorkStore();
  const { setLoading } = useAppStore();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getUserById(id),
          getEducationById(id),
          getHistoryWorkById(id),
          getSkillById(id),
          getInterestedWorkById(id),
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    return () => {
      clearUserDataById();
    };
  }, [id]);
};
