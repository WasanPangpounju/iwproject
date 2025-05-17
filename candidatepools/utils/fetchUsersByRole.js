import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

export const fetchAllUserData = async () => {
  const { getUserAll } = useUserStore.getState();
  const { getEducationAll } = useEducationStore.getState();
  const { getDataHistoryWorkAll } = useHistoryWorkStore.getState();
  const { getDataInterestedWorkAll } = useInterestedWorkStore.getState();

  await Promise.all([
    getUserAll(),
    getEducationAll(),
    getDataHistoryWorkAll(),
    getDataInterestedWorkAll(),
  ]);
};

export const clearAllUserData = () => {
  const { clearUserAll } = useUserStore.getState();
  const { clearEducationAll } = useEducationStore.getState();
  const { clearHistoryWorkAll } = useHistoryWorkStore.getState();
  const { clearInterestedWorkAll } = useInterestedWorkStore.getState();

  clearUserAll();
  clearEducationAll();
  clearHistoryWorkAll();
  clearInterestedWorkAll();
};