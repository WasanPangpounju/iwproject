//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

export const fetchUserDataById = async (id) => {
  const { getUserById } = useUserStore.getState();
  const { getEducationById } = useEducationStore.getState();
  const { getHistoryWorkById } = useHistoryWorkStore.getState();
  const { getSkillById } = useSkillStore.getState();
  const { getInterestedWorkById } = useInterestedWorkStore.getState();

  const [dataUser, dataEducation, dataHistoryWork, dataSkills, dataWorks] =
    await Promise.all([
      getUserById(id),
      getEducationById(id),
      getHistoryWorkById(id),
      getSkillById(id),
      getInterestedWorkById(id),
    ]);

  return {
    dataUser,
    dataEducation,
    dataHistoryWork,
    dataSkills,
    dataWorks,
  };
};
