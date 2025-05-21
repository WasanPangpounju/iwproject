import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useResumeStore } from "@/stores/useResumeStore";
export const useFetchUserData = (id) => {
  const { getUser } = useUserStore();
  const { getEducation } = useEducationStore();
  const { getDataHistoryWork } = useHistoryWorkStore();
  const { getDataSkills } = useSkillStore();
  const { getDataInterestedWork } = useInterestedWorkStore();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      await Promise.all([
        getUser(id),
        getEducation(id),
        getDataHistoryWork(id),
        getDataSkills(id),
        getDataInterestedWork(id),
      ]);
    };

    fetchAll();
  }, [id, getUser, getEducation, getDataHistoryWork, getDataSkills, getDataInterestedWork]);
};
