import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useChatStore } from "@/stores/useChatStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
export const fetchAllUserData = async () => {
  const { getUserAll } = useUserStore.getState();
  const { getEducationAll } = useEducationStore.getState();
  const { getDataHistoryWorkAll } = useHistoryWorkStore.getState();
  const { getDataInterestedWorkAll } = useInterestedWorkStore.getState();
  const { fetchChats } = useChatStore.getState();
  const { fetchCompanies } = useCompanyStore.getState();

  await Promise.all([
    getUserAll(),
    getEducationAll(),
    getDataHistoryWorkAll(),
    getDataInterestedWorkAll(),
    fetchChats(),
    fetchCompanies(),
  ]);
};

export const clearAllUserData = () => {
  const { clearUserAll } = useUserStore.getState();
  const { clearEducationAll } = useEducationStore.getState();
  const { clearHistoryWorkAll } = useHistoryWorkStore.getState();
  const { clearInterestedWorkAll } = useInterestedWorkStore.getState();
  const { clearAllChats } = useChatStore.getState();
  const { clearCompany } = useCompanyStore.getState();

  clearUserAll();
  clearEducationAll();
  clearHistoryWorkAll();
  clearInterestedWorkAll();
  clearAllChats();
  clearCompany();
};
