import { toast } from "sonner";
import { useLensAuthStore } from "@/stores/auth-store";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";
import { useProfileSelectStore } from "@/stores/profile-select-store";
import { useAccount } from "wagmi";

export const useAuthCheck = () => {
  const { currentProfile, sessionClient, loading } = useLensAuthStore();
  const reconnectWallet = useReconnectWallet();
  const { setProfileSelectModalOpen } = useProfileSelectStore();
  const { address } = useAccount();

  // 优化认证判定：优先检查 sessionClient
  const isAuthenticated = !!sessionClient && !loading;
  
  const checkAuthentication = (action: string = "此操作") => {
    if (loading) {
      toast.info("正在加载认证状态，请稍候...");
      return false;
    }

    // 优先检查 sessionClient，如果有则直接通过
    if (sessionClient) {
      return true;
    }

    // 如果没有 sessionClient，则检查其他条件
    // 检查是否有钱包连接
    if (!address) {
      reconnectWallet();
      toast.info(`Please connect your wallet to ${action}`);
      return false;
    }

    // 检查是否有 profile
    if (!currentProfile) {
      setProfileSelectModalOpen(true);
      toast.info(`Please select a profile to ${action}`);
      return false;
    }
    
    return true;
  };

  return {
    isAuthenticated,
    checkAuthentication,
    currentProfile,
    sessionClient,
    loading,
  };
};
