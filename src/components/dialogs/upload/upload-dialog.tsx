"use client"

import { Modal, Group, Stack, useMantineTheme, Text, Box, ActionIcon } from "@mantine/core"
import { useState } from "react"
import { X } from "lucide-react"
import { UploadButton } from "./upload-buttons"
import { ArtDialog } from "../cook/art-dialog"
import { MDialog } from "../moment/moment-dialog"

interface UploadDialogProps {
  opened: boolean
  onClose: () => void
  onButtonClick: (action: string) => void
  selectedAction: string | null
}

export function UploadDialog({ opened, onClose, onButtonClick, selectedAction }: UploadDialogProps) {
  const theme = useMantineTheme()
  const [artDialogOpened, setArtDialogOpened] = useState(false)
  const [momentDialogOpened, setMomentDialogOpened] = useState(false)

  const uploadOptions = [
    {
      label: "Cook", 
      description: "Upload Fan Work",
      icon: "🍪",
      color: "#f97316", // Orange
      disabled: false,
    },
    {
      label: "Moment",
      description: "Capture Memories",
      icon: "🔆",
      color: "#f97316", // Orange
      disabled: false,
    },
    {
      label: "Event",
      description: "Comic Con",
      icon: "🎫",
      color: "#fcdb03", // Yellow
      disabled: true,
    },
  ]

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size="md"
        withCloseButton={false}
        title=""
        overlayProps={{
          backgroundOpacity: 0.4,
          blur: 4,
        }}
        styles={{
          content: {
            background: theme.colors.dark[8],
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.colors.dark[6]}`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            padding: 0,
          },
        }}
      >
        <Box
          style={{
            padding: theme.spacing.xs,
            borderRadius: `${theme.radius.xl}px ${theme.radius.xl}px 0 0`,
            position: "relative",
          }}
        >
          {/* Header Actions */}
          <Group justify="end" mb="xs">
            
            <ActionIcon
              size="md"
              variant="filled"
              color="dark.6"
              radius="xl"
              onClick={onClose}
              style={{
                background: theme.colors.dark[6],
                border: `1px solid ${theme.colors.dark[5]}`,
              }}
            >
              <X size={16} color={theme.colors.gray[3]} />
            </ActionIcon>
          </Group>

          {/* Title Section */}
          <Stack gap="sm" align="center" mb="xs">
            <Text
              size="1.5rem"
              fw={700}
              c="white"
              style={{
                fontFamily: theme.fontFamily,
                letterSpacing: "-0.025em",
              }}
            >
              Upload
            </Text>
            <Text
              size="md"
              c="gray.4"
              style={{
                fontFamily: theme.fontFamily,
                fontWeight: 400,
              }}
            >
              What are we sharing today?
            </Text>
          </Stack>
        </Box>

        {/* Content Area */}
        <Box
          style={{
            padding: theme.spacing.md,
            background: theme.colors.dark[8],
            borderRadius: `0 0 ${theme.radius.xl}px ${theme.radius.xl}px`,
          }}
        >
          <Group justify="center" gap="lg" wrap="nowrap">
            {uploadOptions.map((option, index) => (
              <UploadButton
                key={option.label}
                label={option.label}
                description={option.description}
                icon={option.icon}
                color={option.color}
                onClick={() => {
                  if (option.label === "Cook") {
                    setArtDialogOpened(true)
                  } else if (option.label === "Moment") {
                    setMomentDialogOpened(true)
                  } else {
                    onButtonClick(option.label)
                  }
                }}
                disabled={option.disabled}
              />
            ))}
          </Group>
        </Box>
      </Modal>
      
      {/* Art Dialog */}
      <ArtDialog 
        opened={artDialogOpened} 
        onClose={() => setArtDialogOpened(false)} 
        onComplete={() => {
          setArtDialogOpened(false)  
          onClose()                  
        }}
      />
      
      {/* Moment Dialog */}
      <MDialog 
        opened={momentDialogOpened} 
        onClose={() => setMomentDialogOpened(false)} 
        onComplete={() => {
          setMomentDialogOpened(false)  
          onClose()                  
        }}
      />
    </>
  )
}
