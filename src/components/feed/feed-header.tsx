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
    { value: "follow", label: feedHeaderT("follow"), disabled: true, showSoon: true },
    { value: "latest", label: feedHeaderT("latest"), disabled: false, showSoon: false },
    { value: "explore", label: feedHeaderT("explore"),disabled: true, showSoon: true },
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
        <Group justify="space-between" h="auto" align="flex-start" wrap="nowrap">
          {/* Left: Search Icon */}
          <div style={{ height: "32px", display: "flex", alignItems: "center" }}>
            <ActionIcon 
              variant="transparent" 
              size="lg"
              className="text-gray-600 hover:text-orange-600 cursor-pointer dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              onClick={() => setSearchOpened(true)}
            >
              <Search size={20} />
            </ActionIcon>
          </div>

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
                        borderBottom: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        margin: "0 7px",
                        whiteSpace: "nowrap",
                        minWidth: "auto",
                        flexShrink: 1,
                        paddingTop: "7px",
                      }
                    }
                  )}
                  className={
                    `${activeTab === tab.value
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-800 dark:text-gray-200'} transition-colors`
                  }
                >
                  <Stack gap={2} align="center" style={{ minHeight: "32px" }}>
                    <div style={{ height: "20px", display: "flex", alignItems: "center", position: "relative" }}>
                      {tab.label}
                      {activeTab === tab.value && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-2px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100%",
                            height: "2px",
                            backgroundColor: "#ff6b35",
                            borderRadius: "1px",
                          }}
                        />
                      )}
                    </div>
                    {tab.showSoon ? (
                      <Badge
                        size="xs"
                        variant="light"
                        color="gray"
                        style={{
                          fontSize: "8px",
                          padding: "1px 4px",
                          borderRadius: "6px",
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                      >
                        soon
                      </Badge>
                    ) : (
                      <div style={{ height: "16px" }}></div>
                    )}
                  </Stack>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
          {/* Right: Filter Icon */}
          <div style={{ height: "32px", display: "flex", alignItems: "center" }}>
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
          </div>
          
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
