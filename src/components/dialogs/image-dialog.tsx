"use client"

import { Modal, Button, Box, Group, Text, ActionIcon, useMantineTheme } from "@mantine/core"
import { Carousel } from '@mantine/carousel'
import { Image as MantineImage } from '@mantine/core'
import { ExternalLink, X, Download, Share2, Heart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ImageDialogProps {
  opened: boolean
  onClose: () => void
  images: string[]
  initialSlide?: number
  postId?: string
  onViewPost?: () => void
}

export function ImageDialog({ 
  opened, 
  onClose, 
  images, 
  initialSlide = 0, 
  postId,
  onViewPost 
}: ImageDialogProps) {
  const theme = useMantineTheme()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  const handleViewPost = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (postId) {
      onClose()
      router.push(`/p/${postId}`)
    } else if (onViewPost) {
      onViewPost()
    }
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '查看图片',
          text: '分享一张有趣的图片',
          url: window.location.href,
        })
      } catch (err) {
        console.log('分享失败:', err)
      }
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      withCloseButton={false}
      closeOnClickOutside
      closeOnEscape
      overlayProps={{ 
        backgroundOpacity: 0.9,
        blur: 2,
      }}
      styles={{
        content: {
          backgroundColor: 'var(--mantine-color-dark-8)',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: 0,
          overflow: 'hidden',
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: 'none',
        },
        body: {
          padding: 0,
        }
      }}
    >
      {/* Header with close button and counter */}
      <Group 
        justify="space-between" 
        p="md" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        }}
      >
        <Text size="sm" c="white" fw={500}>
          {currentSlide + 1} / {images.length}
        </Text>
        <ActionIcon
          size="md"
          variant="filled"
          color="dark.6"
          radius="xl"
          onClick={onClose}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          }}
        >
          <X size={16} />
        </ActionIcon>
      </Group>

      {/* Image Carousel */}
      <Carousel
        initialSlide={initialSlide}
        withIndicators
        withControls
        emblaOptions={{ loop: false }}
        onSlideChange={(index) => setCurrentSlide(index)}
        styles={{
          root: {
            backgroundColor: 'var(--mantine-color-dark-8)',
          },
          controls: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          },
          indicator: {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            '&[data-active]': {
              backgroundColor: 'white',
            }
          }
        }}
      >
        {images.map((image, index) => (
          <Carousel.Slide key={index}>
            <MantineImage
              src={image}
              alt={`Image ${index + 1}`}
              fit="contain"
              style={{ 
                maxHeight: '85vh',
                width: '100%',
                objectFit: 'contain'
              }}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
      
      {/* Bottom action bar */}
      <Box 
        style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
          padding: '20px',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'flex-end',
          gap: '12px',
        }}
      >
        <Group gap="sm">
          <Button
            variant="filled"
            color="transparent"
            size="sm"
            radius="xl"
            leftSection={<ExternalLink size={10} />}
            onClick={handleViewPost}
            style={{
              backgroundColor: 'var(--mantine-color-transparent)',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-transparent)',
              }
            }}
          >
            Details
          </Button>
        </Group>
      </Box>
    </Modal>
  )
}
