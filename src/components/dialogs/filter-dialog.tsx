"use client"

import { Modal, Button, Card, Group, Stack, Text, UnstyledButton } from "@mantine/core"
import { Settings, Globe, Star, AlertTriangle, Ban, Shield, Heart, Brain, Hash, Users } from "lucide-react"
import { useState } from "react"
//import { useDisabled } from "@/utils/disabled"
import { useTagFilter } from "@/contexts/tag-filter-context"

/*
interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}
*/

const RATING_OPTIONS = [
  {
    value: "general-rate",
    label: "全年龄",
    description: "适合所有年龄段的内容",
    icon: <Star className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "teen-rate",
    label: "青少年级",
    description: "可能不适合13岁以下的内容",
    icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "mature-rate",
    label: "成人级",
    description: "包含暴力、色情等内容",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "explicit-rate",
    label: "限制级",
    description: "包含严重露骨的暴力、色情等内容",
    icon: <Ban className="h-4 w-4 text-orange-500" />,
  },
]

const WARNING_OPTIONS = [
  {
    value: "none-warning",
    label: "无内容预警",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "ai-warning",
    label: "AI生成内容预警",
    icon: <Brain className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "violence-warning",
    label: "暴力描述预警",
    icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "death-warning",
    label: "主角死亡预警",
    icon: <Heart className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "noncon-warning",
    label: "强制/非自愿预警",
    icon: <Ban className="h-4 w-4 text-orange-500" />,
  },
  {
    value: "underage-warning",
    label: "未成年性行为预警",
    icon: <Shield className="h-4 w-4 text-orange-500" />,
  },
]

const CATEGORY_OPTIONS = [
  { value: "none-relationship", label: "综合", icon: <Globe className="h-4 w-4 text-orange-500" /> },
  { value: "gl", label: "GL", icon: <Heart className="h-4 w-4 text-orange-500" /> },
  { value: "gb", label: "GB", icon: <Heart className="h-4 w-4 text-orange-500" /> },  
  { value: "bl", label: "BL", icon: <Heart className="h-4 w-4 text-orange-500" /> },
  { value: "gen-relationship", label: "无CP", icon: <Hash className="h-4 w-4 text-orange-500" /> },
  { value: "multi-relationship", label: "多元", icon: <Users className="h-4 w-4 text-orange-500" /> },
]


interface FilterDialogProps {
  trigger?: React.ReactNode
  onFiltersChange?: (filters: {
    categories: string
    rating: string
    warning: string[]
    tags: string[]
  }) => void
}

export function FilterDialog({ trigger, onFiltersChange }: FilterDialogProps) {
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [selectedWarning, setSelectedWarning] = useState<string[]>([])
  
  const { 
    tagFilter, 
    addPresetTag, 
    removePresetTag, 
    clearPresetTags,
  } = useTagFilter()

  const handleReset = () => {
    setSelectedCategory("")
    setSelectedRating("")
    setSelectedWarning([])
    clearPresetTags()
  }

  const updateFilters = () => {
    onFiltersChange?.({
      categories: selectedCategory,
      rating: selectedRating,
      warning: selectedWarning,
      tags: tagFilter.allTags,
    })
  }

  return (
    <>
      <UnstyledButton onClick={() => setShowFilterSheet(true)}>
        {trigger}
      </UnstyledButton>

      <Modal
        opened={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        size="lg"
        fullScreen={true}
        title={
          <Group justify="center" gap="xs">
            <Settings size={16} />
            <Text fw={600} size="lg" c="#1c1c1c">投稿分类筛选器-并选</Text>
          </Group>
        }
      >
        <Stack gap="lg">
          <Group grow align="stretch" gap="md" className="flex-col items-center lg:flex-row lg:items-stretch lg:justify-center">
            {/* Categories Section */}
            <Card withBorder shadow="sm" padding="md" radius="md" style={{ width: '100%', maxWidth: '400px' }}>
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <Globe size={16} className="text-orange-500" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>频道</Text>
                  </Group>
                </Group>

                <Group gap="xs" wrap="wrap">
                  {CATEGORY_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => {
                        // 频道单选
                        if (selectedCategory === option.value) {
                          setSelectedCategory("")
                          removePresetTag(option.value)
                        } else {
                          const currentCategoryTag = CATEGORY_OPTIONS.find(category => category.value === selectedCategory)
                          if (currentCategoryTag) {
                            removePresetTag(currentCategoryTag.value)
                          }
                          setSelectedCategory(option.value)
                          addPresetTag(option.value)
                        }
                      }}
                      style={{
                        width: "calc(50% - 4px)",
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: (selectedCategory === option.value || tagFilter.presetTags.includes(option.value)) ? "#ff6b35" : "#e9ecef",
                        background: (selectedCategory === option.value || tagFilter.presetTags.includes(option.value)) ? "#fff5f0" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <Stack gap={4} align="center">
                        {option.icon}
                        <Text size="sm" fw={500}>{option.label}</Text>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </Group>
              </Stack>
            </Card>

            {/* Rating Section */}
            <Card withBorder shadow="sm" padding="md" radius="md" style={{ width: '100%', maxWidth: '400px' }}>
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <Star size={16} className="text-orange-500" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>分级</Text>
                  </Group>
                </Group>

                <Stack gap="xs">
                  {RATING_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => {
                        // 分级单选
                        if (selectedRating === option.value) {
                          setSelectedRating("")
                          removePresetTag(option.value)
                        } else {
                          // 清除之前选中的分级标签
                          const currentRatingTag = RATING_OPTIONS.find(rating => rating.value === selectedRating)
                          if (currentRatingTag) {
                            removePresetTag(currentRatingTag.value)
                          }
                          setSelectedRating(option.value)
                          addPresetTag(option.value)
                        }
                      }}
                      style={{
                        minHeight: "60px",
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: (selectedRating === option.value || tagFilter.presetTags.includes(option.value)) ? "#ff6b35" : "#e9ecef",
                        background: (selectedRating === option.value || tagFilter.presetTags.includes(option.value)) ? "#fff5f0" : "white",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Stack gap={4}>
                        <Group gap="xs">
                          {option.icon}
                          <Text size="sm" fw={500}>{option.label}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">{option.description}</Text>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </Stack>
              </Stack>
            </Card>

            {/* Warning Section */}
            <Card withBorder shadow="sm" padding="md" radius="md" style={{ width: '100%', maxWidth: '400px' }}>
              <Stack gap="sm">
                <Group gap="xs">
                  <div style={{ padding: 6, background: "#f8f9fa", borderRadius: 8 }}>
                    <AlertTriangle size={16} className="text-orange-500" />
                  </div>
                  <Group gap={4}>
                    <Text fw={600}>预警</Text>
                  </Group>
                </Group>

                <Group gap="xs" wrap="wrap">
                  {WARNING_OPTIONS.map((option) => (
                    <UnstyledButton
                      key={option.value}
                      onClick={() => {
                        if (selectedWarning.includes(option.value)) {
                          setSelectedWarning((prev) => 
                            prev.filter((t) => t !== option.value)
                          )
                        } else {
                          setSelectedWarning((prev) => [...prev, option.value])
                        }
                        if (tagFilter.presetTags.includes(option.value)) {
                          removePresetTag(option.value)
                        } else {
                          addPresetTag(option.value)
                        }
                      }}
                      style={{
                        width: "100%",
                        height: "60px",
                        padding: 12,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: (selectedWarning.includes(option.value) || tagFilter.presetTags.includes(option.value)) ? "#ff6b35" : "#e9ecef",
                        background: (selectedWarning.includes(option.value) || tagFilter.presetTags.includes(option.value)) ? "#fff5f0" : "white",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexShrink: 1,
                      }}
                    >
                      <Stack gap={4}>
                        <Group gap="xs" justify="start">
                        {option.icon}
                          <Text size="sm" fw={500}>{option.label}</Text>
                        </Group>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </Group>
              </Stack>
            </Card>
          </Group>

          {/* Bottom Action Buttons 目前确定按钮作为摆设 */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-6 "
            >
              重置
            </Button>
            <Button
              onClick={() => {
                updateFilters()
                setShowFilterSheet(false)
              }}
              style={{ paddingLeft: 24, paddingRight: 24 }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              确定
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}