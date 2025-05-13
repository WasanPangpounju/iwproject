//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";

export const fetchUserDataById = async (id) => {
  const { getUserById } = useUserStore.getState();
  const { getEducationById } = useEducationStore.getState();
  const { getHistoryWorkById } = useHistoryWorkStore.getState();
  const { getSkillById } = useSkillStore.getState();

  const [dataUser, dataEducation, dataHistoryWork, dataSkills] =
    await Promise.all([
      getUserById(id),
      getEducationById(id),
      getHistoryWorkById(id),
      getSkillById(id),
    ]);

  return {
    dataUser,
    dataEducation,
    dataHistoryWork,
    dataSkills,
  };
};
