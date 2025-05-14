import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

export const useFetchUserDataById = (id) => {
  const { getUserById } = useUserStore();
  const { getEducationById } = useEducationStore();
  const { getHistoryWorkById } = useHistoryWorkStore();
  const { getSkillById } = useSkillStore();
  const { getInterestedWorkById } = useInterestedWorkStore();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      await Promise.all([
        getUserById(id),
        getEducationById(id),
        getHistoryWorkById(id),
        getSkillById(id),
        getInterestedWorkById(id),
      ]);
    };

    fetchAll();
  }, [
    id,
    getUserById,
    getEducationById,
    getHistoryWorkById,
    getSkillById,
    getInterestedWorkById,
  ]);
};
