"use client"

import { Group, ActionIcon, Tabs, Box, Badge, Flex, Text, Stack } from "@mantine/core"
import { Search, Filter, X, Hash, FileText } from "lucide-react"
import { useState } from "react"
import { useDisabled } from "@/utils/disabled"
import { FilterDialog } from "@/components/dialogs/filter-dialog"
import { SearchDialog } from "@/components/dialogs/search/search-dialog"
import { useTagFilter } from "@/contexts/tag-filter-context"
//import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl";


export function FeedHeader() {
  //const [opened, { toggle }] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState("latest")
  const [searchOpened, setSearchOpened] = useState(false)
  const feedHeaderT = useTranslations("feedHeader");
  
  // 使用标签筛选上下文
  const { 
    tagFilter, 
    removePresetTag, 
    removeCustomTag,
    clearSearchQuery,
    hasActiveFilters 
  } = useTagFilter()
  const mainTabs = [
    { value: "follow", label: feedHeaderT("follow"), disabled: true },
    { value: "latest", label: feedHeaderT("latest"), disabled: false },
    { value: "explore", label: feedHeaderT("explore"),disabled: true },
  ]

  //const router = useRouter()

  return (
    <Box>
      {/* Main Header */}
      <Box
        h={"auto"}
        px={{ base: "sm", sm: "md" }}
        style={{
          //borderBottom: "1px solid #f0f0f0",
          backgroundColor: "transparent",
          //position: "sticky",
          //top: 0,
          //zIndex: 100,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Group justify="space-between" h="auto" align="center" wrap="nowrap">
          {/* Left: Search Icon */}
          <ActionIcon 
            variant="transparent" 
            size="lg"
            className="text-gray-600 hover:text-orange-600 cursor-pointer dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            onClick={() => setSearchOpened(true)}
          >
            <Search size={20} />
          </ActionIcon>

          {/* Center: Main Navigation Tabs */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "latest")} variant="unstyled">
            <Tabs.List style={{ overflow: "hidden", flexShrink: 1, flexWrap: "nowrap" }}>
              {mainTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  {...useDisabled(
                    {
                      isDisabled: tab.disabled,
                      baseStyles: {
                        fontSize: "16px",
                        fontWeight: 500,
                        padding: "5px 5px",
                        borderBottom: activeTab === tab.value ? "2px solid #ff6b35 " : "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        margin: "0 7px",
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        flexShrink: 1,
                      }
                    }
                  )}
                  className={
                    `${activeTab === tab.value
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-800 dark:text-gray-200'} transition-colors`
                  }
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
          {/* Right: Filter Icon */}
          <FilterDialog
            trigger={
              <ActionIcon 
                variant="transparent" 
                size="lg"
                className="text-gray-600 hover:text-orange-600 cursor-pointer dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <Filter size={20} />
              </ActionIcon>
            }
            onFiltersChange={(filters) => {
            }}
          />
          
        </Group>
      </Box>

      {/* Active Tags Display */}
      {hasActiveFilters && (
        <Box
          px={{ base: "sm", sm: "md" }}
          py="sm"
          style={{
            backgroundColor: "transparent",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Stack gap="sm">
            <Group gap="xs" align="center">
              <Text size="sm" fw={500} c="dimmed">
                筛选结果
              </Text>
            </Group>
            <Flex wrap="wrap" gap="xs">
              {/* 标签 */}
              {tagFilter.allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="light"
                  color="orange"
                  size="lg"
                  leftSection={<Hash size={14} className="text-orange-500" />}
                  rightSection={
                    <X 
                      size={12} 
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (tagFilter.presetTags.includes(tag)) {
                          removePresetTag(tag)
                        } else if (tagFilter.customTags.includes(tag)) {
                          removeCustomTag(tag)
                        }
                      }}
                    />
                  }
                >
                  {tag}
                </Badge>
              ))}
              {/* 内容 */}
              {tagFilter.searchQuery && (
                  <Badge
                    variant="light"
                    color="orange"
                    size="lg"
                    leftSection={<FileText size={14} className="text-orange-500" />}
                    rightSection={
                      <X 
                        size={12} 
                        style={{ cursor: "pointer" }}
                        onClick={clearSearchQuery}
                      />
                    }
                  >
                    {tagFilter.searchQuery}
                  </Badge>
              )}
            </Flex>
          </Stack>
        </Box>
      )}

      {/* Search Dialog */}
      <SearchDialog 
        opened={searchOpened} 
        onClose={() => setSearchOpened(false)} 
      />
    </Box>
  )
}
