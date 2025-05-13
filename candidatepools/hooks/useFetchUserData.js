import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";

export const useFetchUserData = (id) => {
  const { getUser } = useUserStore();
  const { getEducation } = useEducationStore();
  const { getDataHistoryWork } = useHistoryWorkStore();
  const { getDataSkills } = useSkillStore();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      await Promise.all([
        getUser(id),
        getEducation(id),
        getDataHistoryWork(id),
        getDataSkills(id),
      ]);
    };

    fetchAll();
  }, [id, getUser, getEducation, getDataHistoryWork, getDataSkills]);
};
