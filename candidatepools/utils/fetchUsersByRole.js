import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useChatStore } from "@/stores/useChatStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useSystemLogStore } from "@/stores/useSystemLogStore";
import { useSkillStore } from "@/stores/useSkillStore";
import useAppStore from "@/stores/useAppStore";

export const fetchAllUserData = async () => {
  const { getUserAll } = useUserStore.getState();
  const { getEducationAll } = useEducationStore.getState();
  const { getDataHistoryWorkAll } = useHistoryWorkStore.getState();
  const { getDataInterestedWorkAll } = useInterestedWorkStore.getState();
  const { fetchChats } = useChatStore.getState();
  const { fetchCompanies } = useCompanyStore.getState();
  const { getLogs } = useSystemLogStore.getState();
  const { setLoading } = useAppStore.getState(); 
  const { getDataSkillAll } = useSkillStore.getState(); 

  try {
    setLoading(true); // ✅ เริ่มโหลด

    await Promise.all([
      getUserAll(),
      getEducationAll(),
      getDataHistoryWorkAll(),
      getDataInterestedWorkAll(),
      fetchChats(),
      fetchCompanies(),
      getLogs(),
      getDataSkillAll(),
    ]);
  } catch (err) {
    console.error("Error fetching all user data:", err);
  } finally {
    setLoading(false); 
  }
};

export const clearAllUserData = () => {
  const { clearUserAll } = useUserStore.getState();
  const { clearEducationAll } = useEducationStore.getState();
  const { clearHistoryWorkAll } = useHistoryWorkStore.getState();
  const { clearInterestedWorkAll } = useInterestedWorkStore.getState();
  const { clearAllChats } = useChatStore.getState();
  const { clearCompany } = useCompanyStore.getState();
  const { clearSystemLogs } = useSystemLogStore.getState();
  const { clearSkillAll } = useSkillStore.getState();

  clearUserAll();
  clearEducationAll();
  clearHistoryWorkAll();
  clearInterestedWorkAll();
  clearAllChats();
  clearCompany();
  clearSystemLogs();
  clearSkillAll();
};
