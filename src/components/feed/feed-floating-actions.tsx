"use client";

import { ActionIcon, Stack, Transition, Tooltip } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { RefreshCw, ArrowUp, Plus } from "lucide-react";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedViewToggle } from "./feed-view-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadDialog } from "../dialogs/upload/upload-dialog";

interface FeedFloatingActionsProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastRefreshTime?: Date;
}

export function FeedFloatingActions({ 
  onRefresh, 
  refreshing,
  lastRefreshTime 
}: FeedFloatingActionsProps) {
  const { width } = useViewportSize();
  const isMobile = width < 768; // md breakpoint
  const router = useRouter();
  const [uploadDialogOpened, setUploadDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadButtonClick = (action: string) => {
    setSelectedAction(action);
    if (action === "Cook Work") {
      setUploadDialogOpened(false);
      router.push("/create");
    }
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpened(false);
    setSelectedAction(null);
  };

  return (
    <>
      <Transition
        mounted={true}
        transition="slide-left"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <div
            style={{
              position: "fixed",
              right: isMobile ? 16 : 16,
              bottom: isMobile ? 58 : 32,
              zIndex: 50,
              ...styles,
            }}
          >
            <Stack gap="s" align="center">
              {/* 发布作品 */}
              <Tooltip
                label="发布作品"
                position="left"
                withArrow
                transitionProps={{ transition: 'fade', duration: 200 }}
                color="orange"
              >
                <ActionIcon
                  variant="light"
                  size={42}
                  radius="xl"
                  style={{
                    backgroundColor: "#ff6b35",
                    boxShadow: "0 0 10px 0 rgba(255, 107, 53, 0.3)",
                    borderRadius: "100%",
                  }}
                  onClick={() => setUploadDialogOpened(true)}
                  aria-label="发布作品"
                >
                  <Plus 
                    strokeWidth={2.5} 
                    size={24}
                    color="white"
                  />
                </ActionIcon>
              </Tooltip>

              {/* 刷新 */}
              <Tooltip
                label={lastRefreshTime ? `上次更新: ${lastRefreshTime.toLocaleTimeString()}` : "刷新"}
                position="left"
                withArrow
                transitionProps={{ transition: 'fade', duration: 200 }}
              >
                <ActionIcon
                  variant="light"
                  size={42}
                  radius="xl"
                  style={{
                    backgroundColor: "var(--mantine-color-white)",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                    borderRadius: "100%",

                  }}
                  color="gray"
                  onClick={onRefresh}
                  disabled={refreshing}
                  aria-label="刷新"
                >
                  <RefreshCw 
                    strokeWidth={1.5} 
                    size={24} 
                    className={refreshing ? "animate-spin" : ""}
                  />
                </ActionIcon>
              </Tooltip>
              
              {/* 视图切换 */}
              <FeedViewToggle />

              {/* 返回顶部 */}
              <Tooltip
                label="返回顶部"
                position="left"
                withArrow
                transitionProps={{ transition: 'fade', duration: 200 }}
              >
                <ActionIcon
                  variant="light"
                  size={42}
                  radius="xl"
                  style={{
                    backgroundColor: "var(--mantine-color-white)",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                    borderRadius: "100%",
                  }}
                  color="gray"
                  onClick={handleScrollToTop}
                  aria-label="返回顶部"
                >
                  <ArrowUp 
                    strokeWidth={1.5} 
                    size={24}
                  />
                </ActionIcon>
              </Tooltip>
              
            </Stack>
          </div>
        )}
      </Transition>
      
      <UploadDialog
        opened={uploadDialogOpened}
        onClose={handleUploadDialogClose}
        onButtonClick={handleUploadButtonClick}
        selectedAction={selectedAction}
      />
    </>
  );
}