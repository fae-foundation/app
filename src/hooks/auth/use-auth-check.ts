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

  // 完全认证判定：profile + sessionClient
  const isAuthenticated = !!address && !!currentProfile && !!sessionClient && !loading;
  
  const checkAuthentication = (action: string = "此操作") => {
    if (loading) {
      toast.info("正在加载认证状态，请稍候...");
      return false;
    }

    // 检查是否有钱包连接
    if (!address) {
      reconnectWallet();
      toast.info(`Please connect your wallet to ${action}`);
      return false;
    }

    // 检查是否选择了 profile
    if (!sessionClient) {
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
