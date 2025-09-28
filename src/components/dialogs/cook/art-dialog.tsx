"use client"

import { Modal } from "@mantine/core"
import { ArtCreateForm } from "@/components/dialogs/cook/art-create-form"

interface ArtDialogProps {
  opened: boolean
  onClose: () => void
  onComplete?: () => void
}

export function ArtDialog({ opened, onClose, onComplete }: ArtDialogProps) {
  const handleComplete = () => {
    // 触发全局 feed 刷新事件
    window.dispatchEvent(new CustomEvent('feed-refresh'))
    // 调用原始的 onComplete 回调
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="xl"
      withCloseButton={false}
      title=""
      zIndex={1000}
      overlayProps={{
        backgroundOpacity: 0.15,
        blur: 3,
      }}
      styles={{
        content: {
          background: "transparent",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          minHeight: "100vh",
        },
      }}
    >
      <ArtCreateForm 
      onClose={onClose} 
      onComplete={handleComplete}
      />
    </Modal>
  )
}
