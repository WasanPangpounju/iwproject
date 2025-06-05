import { useEffect } from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import useAppStore from "@/stores/useAppStore";

export const useFetchUserData = (id) => {
  const { getUser } = useUserStore();
  const { getEducation } = useEducationStore();
  const { getDataHistoryWork } = useHistoryWorkStore();
  const { getDataSkills } = useSkillStore();
  const { getDataInterestedWork } = useInterestedWorkStore();
  const { setLoading } = useAppStore();
  const { fetchPosts } = useAppStore.getState();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getUser(id),
          getEducation(id),
          getDataHistoryWork(id),
          getDataSkills(id),
          getDataInterestedWork(id),
          fetchPosts(),
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [
    id,
    getUser,
    getEducation,
    getDataHistoryWork,
    getDataSkills,
    getDataInterestedWork,
  ]);
};
