"use client"

import { Modal } from "@mantine/core"
import { MCreateForm } from "@/components/dialogs/moment/moment-create-form"

interface MDialogProps {
  opened: boolean
  onClose: () => void
  onComplete?: () => void
}

export function MDialog({ opened, onClose, onComplete }: MDialogProps) {
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
      <MCreateForm 
      onClose={onClose} 
      onComplete={onComplete}
      />
    </Modal>
  )
}
