"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  Group,
  ActionIcon,
  TextInput,
  Button,
  Text,
  Badge,
  Stack,
  Menu,
  Flex,
  Box,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core"
import {
  Hash,
  User,
  FileText,
  Key,
  ChevronDown,
  Trash,
  X,
  Search,
} from "lucide-react"
import { SearchResults } from "@/components/dialogs/search/search-results"
import { useTagFilter } from "@/contexts/tag-filter-context"
import { useFeed } from "@/hooks/use-feed"

interface SearchHistoryItem {
  id: string
  text: string
  type: "tag" | "people" | "content" | "token"
  timestamp: Date
}

const searchTypeConfig = {
  tag: { icon: Hash, label: "Tag" },
  content: { icon: FileText, label: "Content" },
  people: { icon: User, label: "User" },
  token: { icon: Key, label: "Token ID" },
}

interface SearchDialogProps {
  opened: boolean
  onClose: () => void
}

export function SearchDialog({ opened, onClose }: SearchDialogProps) {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState<keyof typeof searchTypeConfig>("tag")
  const [isSearching, setIsSearching] = useState(false)
  
  const { 
    addCustomTag,
    setSearchQuery,
  } = useTagFilter()
  
  // 使用feed hook获取帖子数据
  const { posts } = useFeed()
  
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])

  useEffect(() => {
    if (searchValue.trim()) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
      }, 1000)
    }
  }, [selectedType, searchValue])

  const handleSearch = () => {
    if (searchValue.trim()) {
      setIsSearching(true)
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        text: searchValue.trim(),
        type: selectedType,
        timestamp: new Date(),
      }
      setSearchHistory((prev) => [newItem, ...prev.slice(0, 9)]) // Keep only 10 items

      if (selectedType === "tag") {
        addCustomTag(searchValue.trim())
      } else if (selectedType === "content") {
        handleContentSearch(searchValue.trim())
      }

      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
      }, 2000)
    }
  }

  const handleContentSearch = async (query: string) => {
    // 设置搜索查询到Context，让feed自动更新
    setSearchQuery(query)
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setSearchValue(value)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const clearInput = () => {
    setSearchValue("")
  }

  const SelectedIcon = searchTypeConfig[selectedType].icon

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={
        <Group gap="xs">
          <Search size={16} />
          <Text fw={600} size="lg">搜索</Text>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Search Input */}
        <Group
          gap={0}
          style={{
            border: `1px solid ${colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          }}
        >
          <Menu shadow="md" width={120}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color={colorScheme === "dark" ? "white" : "gray"}
                size="lg"
                style={{
                  borderRadius: 0,
                  borderRight: `1px solid ${colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
                  minWidth: "48px",
                }}
              >
                <Group gap={4}>
                  <SelectedIcon size={16} />
                  <ChevronDown size={12} />
                </Group>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {Object.entries(searchTypeConfig).map(([key, config]) => {
                const IconComponent = config.icon
                return (
                  <Menu.Item
                    key={key}
                    leftSection={<IconComponent size={16} />}
                    onClick={() => setSelectedType(key as keyof typeof searchTypeConfig)}
                  >
                    {config.label}
                  </Menu.Item>
                )
              })}
            </Menu.Dropdown>
          </Menu>

          <Box style={{ flex: 1, position: "relative" }}>
            <TextInput
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              variant="unstyled"
              style={{ width: "100%" }}
              styles={{
                input: {
                  border: "none",
                  padding: "8px 12px",
                  paddingRight: searchValue ? "36px" : "12px",
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  color: colorScheme === "dark" ? theme.white : theme.black,
                },
              }}
            />
            {searchValue && (
              <ActionIcon
                variant="subtle"
                color={colorScheme === "dark" ? "white" : "gray"}
                size="sm"
                onClick={clearInput}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <X size={14} />
              </ActionIcon>
            )}
          </Box>

          <Button 
            variant="transparent" 
            color="gray" 
            size="sm" 
            onClick={() => {
              handleSearch()
              onClose()
            }} 
            leftSection={<Search size={16} />}
            style={{ borderRadius: 0 }}
          >
            搜索
          </Button>
        </Group>

        {searchValue.trim() ? (
          <SearchResults 
            searchValue={searchValue} 
            selectedType={selectedType} 
            isLoading={isSearching}
            feedPosts={posts}
            onTagClick={(tag) => {
              addCustomTag(tag)
              onClose()
            }}
          />
        ) : (
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500} c={colorScheme === "dark" ? "white" : "dimmed"}>
                最近搜索
              </Text>
              <ActionIcon
                variant="subtle"
                color={colorScheme === "dark" ? "white" : "gray"}
                size="sm"
                onClick={clearHistory}
              >
                <Trash size={14} />
              </ActionIcon>
            </Group>

            {searchHistory.length > 0 ? (
              <Flex wrap="wrap" gap="xs">
                {searchHistory.map((item) => {
                  const IconComponent = searchTypeConfig[item.type].icon

                  return (
                    <Badge
                      key={item.id}
                      variant="light"
                      color="gray"
                      size="lg"
                      style={{ cursor: "pointer" }}
                      leftSection={<IconComponent size={12} />}
                      onClick={() => {
                        setSearchValue(item.text)
                        setSelectedType(item.type)

                        if (item.type === "tag") {
                          addCustomTag(item.text)
                        }
                      }}
                    >
                      {item.type === "tag" ? `${item.text}` : item.text}
                    </Badge>
                  )
                })}
              </Flex>
            ) : (
              <Text size="sm" c={colorScheme === "dark" ? "white" : "dimmed"} ta="center" py="md">
                暂无搜索记录
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </Modal>
  )
}
