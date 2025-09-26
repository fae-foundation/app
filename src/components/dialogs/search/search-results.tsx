"use client"
import { Stack, Text, Group, Card, Badge, Skeleton, useMantineColorScheme, useMantineTheme, UnstyledButton } from "@mantine/core"
import { Hash, User, FileText, Key } from "lucide-react"
import { Post } from "@lens-protocol/client"
import { useTagFilter } from "@/contexts/tag-filter-context"

interface SearchResultsProps {
  searchValue: string
  selectedType: "tag" | "people" | "content" | "token"
  isLoading?: boolean
  feedPosts?: Post[] // 添加feed数据
  onTagClick?: (tag: string) => void // 标签点击回调
}

const searchTypeConfig = {
  tag: { icon: Hash, label: "Tag", color: "blue" },
  people: { icon: User, label: "People", color: "green" },
  content: { icon: FileText, label: "Content", color: "orange" },
  token: { icon: Key, label: "Token ID", color: "red" },
}

// 从feed数据中提取标签
const extractTagsFromPosts = (posts: Post[], searchValue: string): string[] => {
  const allTags = new Set<string>()
  
  posts.forEach(post => {
    // 检查metadata是否存在且包含tags
    if (post.metadata && 'tags' in post.metadata && post.metadata.tags) {
      const tags = post.metadata.tags as string[]
      tags.forEach((tag: string) => {
        // 只包含匹配搜索值的标签
        if (tag.toLowerCase().includes(searchValue.toLowerCase())) {
          allTags.add(tag)
        }
      })
    }
  })
  
  return Array.from(allTags).sort()
}

// People skeleton with avatar
const PeopleSkeleton = () => {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <Stack gap="sm">
      {[...Array(5)].map((_, index) => (
        <Card key={index} padding="md" radius="md" withBorder>
          <Group>
            <Skeleton height={40} circle />
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={16} width="60%" />
              <Skeleton height={12} width="40%" />
            </Stack>
            <Skeleton height={32} width={60} />
          </Group>
        </Card>
      ))}
    </Stack>
  )
}

// Content/Token ID skeleton - normal post cards
const PostCardSkeleton = () => (
  <Stack gap="sm">
    {[...Array(4)].map((_, index) => (
      <Card key={index} padding="md" radius="md" withBorder>
        <Stack gap="sm">
          <Group>
            <Skeleton height={32} circle />
            <Stack gap={2} style={{ flex: 1 }}>
              <Skeleton height={14} width="30%" />
              <Skeleton height={12} width="20%" />
            </Stack>
          </Group>
          <Skeleton height={16} width="80%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="90%" />
          <Group mt="xs">
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
          </Group>
        </Stack>
      </Card>
    ))}
  </Stack>
)

// Tag skeleton with # tags arranged
const TagSkeleton = () => {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <Stack gap="md">
      <Stack gap="xs">
        {[...Array(12)].map((_, index) => (
          <Group key={index} gap="xs">
            <Hash size={16} color={colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]} />
            <Skeleton height={14} width={Math.random() * 80 + 60} />
          </Group>
        ))}
      </Stack>
    </Stack>
  )
}

export function SearchResults({ searchValue, selectedType, isLoading = true, feedPosts = [], onTagClick }: SearchResultsProps) {
  if (!searchValue.trim()) {
    return null
  }

  if (selectedType === "content") {
    return null
  }

  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const { addCustomTag } = useTagFilter()

  const renderSkeleton = () => {
    switch (selectedType) {
      case "people":
        return <PeopleSkeleton />
      //case "content":
      case "token":
        return <PostCardSkeleton />
      case "tag":
        return <TagSkeleton />
      default:
        return <PostCardSkeleton />
    }
  }

  const renderTagResults = () => {
    if (isLoading) {
      return <TagSkeleton />
    }

    const matchingTags = extractTagsFromPosts(feedPosts, searchValue)
    
    if (matchingTags.length === 0) {
      return (
        <Text size="sm" c="dimmed" ta="center" py="xl">
          暂无匹配的标签
        </Text>
      )
    }

    return (
      <Stack gap="xs">
        {matchingTags.map((tag, index) => (
          <UnstyledButton
            key={index}
            onClick={() => {
              addCustomTag(tag);
              onTagClick?.(tag);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid transparent",
              transition: "all 0.2s",
              backgroundColor: "transparent",
            }}
            className="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Group gap="xs">
              <Hash 
                size={16} 
                color={colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]} 
              />
              <Text size="sm" fw={500}>
                {tag}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    )
  }

  const renderResults = () => {
    if (selectedType === "tag") {
      return renderTagResults()
    }

    if (isLoading) {
      return renderSkeleton()
    }

    return (
      <Text size="sm" c="dimmed" ta="center" py="xl">
        暂无搜索结果
      </Text>
    )
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="dimmed">
          搜索结果 "{searchValue}"
        </Text>
        <Badge variant="light" color={searchTypeConfig[selectedType].color} size="sm">
          {searchTypeConfig[selectedType].label}
        </Badge>
      </Group>

      {renderResults()}
    </Stack>
  )
}
