"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bold, Italic, Underline, Strikethrough, Link, AtSign, MessageSquare, Plus, X, Search, Expand, Globe } from "lucide-react"
import { TagDisplay } from "@/components/ui/tag-display"
import { SearchResults } from "@/components/dialogs/search/search-results"
import { useFeed } from "@/hooks/use-feed"
//import { Input } from "@/components/ui/input"


interface Tag {
  name: string
}

interface UnifiedEditorProps {
  title: string
  onTitleChange: (title: string) => void
  content: string
  onContentChange: (content: string) => void
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export function UnifiedEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  tags,
  onTagsChange,
  isExpanded = false,
  onExpandedChange,
}: UnifiedEditorProps) {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [tagInput, setTagInput] = useState("")
  const [showTagModal, setShowTagModal] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  
  // 获取 feed 数据用于标签搜索
  const { posts } = useFeed()


  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onTitleChange(value)

    // Auto-resize textarea
    if (titleRef.current) {
      titleRef.current.style.height = "auto"
      titleRef.current.style.height = titleRef.current.scrollHeight + "px"
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onContentChange(value)
    setCharacterCount(value.length)

    // Auto-resize textarea
    if (contentRef.current) {
      contentRef.current.style.height = "auto"
      contentRef.current.style.height = contentRef.current.scrollHeight + "px"
    }
  }

  const addTagToSelection = (tag: Tag) => {
    if (!selectedTags.find((t) => t.name === tag.name)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTagFromSelection = (tagName: string) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName))
  }

  const saveSelectedTags = () => {
    const newTags = [...tags]
    selectedTags.forEach((tag) => {
      if (!newTags.find((t) => t.name === tag.name)) {
        newTags.push(tag)
      }
    })
    onTagsChange(newTags)
    setSelectedTags([])
    setTagInput("")
    setShowTagModal(false)
  }

  const removeTag = (tagName: string) => {
    onTagsChange(tags.filter((t) => t.name !== tagName))
  }

  const formatText = (format: string) => {
    // This would implement text formatting logic
    console.log(`Formatting text with: ${format}`)
  }

  const openTagModal = () => {
    setSelectedTags([])
    setTagInput("")
    setShowTagModal(true)
  }

  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      {/* Title Input */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-dashed">
        <textarea
          ref={titleRef}
          placeholder="标题"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 resize-none border-none outline-none bg-transparent placeholder-gray-400 text-base"
          rows={1}
          maxLength={30}
        />
        <div className="flex gap-1 text-xs text-muted-foreground">
          {title.length}/30 
          <div className="text-destructive">*</div>
        </div>
      </div>

      {/* Content Input */}
      <div className="px-4 py-2.5">
        <textarea
          ref={contentRef}
          placeholder="分享你的想法 ..."
          value={content}
          onChange={handleContentChange}
          className="w-full text-gray-700 resize-none border-none outline-none bg-transparent placeholder-gray-400 text-sm dark:text-gray-300"
          rows={5}
          maxLength={5000}
        />
        <div className="flex gap-1 justify-end text-xs text-muted-foreground">
          {content.length}/5000 
          <div className="text-destructive">*</div>
        </div>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="px-4 py-2 border-t border-none">
          <TagDisplay 
            tags={tags} 
            onRemove={removeTag}
            showRemoveButton={true}
          />
        </div>
      )}

      {/* Tag Input Section */}
      <div className="px-4 py-2 border-t border-gray-100 border-none">
        {/* Add Tag Button */}
        <button
          type="button"
          onClick={openTagModal}
          className="flex items-center gap-2 p-3 rounded-lg border-gray-300 hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-700 border w-fit border-solid py-1 px-1.5 dark:text-gray-300 dark:hover:text-gray-200 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">添加标签</span>
        </button>
      </div>

      {/* Tag Addition Modal */}
      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent className="sm:max-w-md z-[1000]" style={{ zIndex: 1000 }}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">添加标签</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索或创建推荐标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Selected Tags Preview */}
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">已选择的标签:</p>
                <TagDisplay 
                  tags={selectedTags} 
                  onRemove={removeTagFromSelection}
                  showRemoveButton={true}
                />
              </div>
            )}

            {/* Tag Suggestions */}
            {tagInput.length > 0 && (
              <div className="space-y-2">
                <SearchResults 
                  searchValue={tagInput} 
                  selectedType="tag" 
                  isLoading={false}
                  feedPosts={posts}
                  onTagClick={(tag) => addTagToSelection({ name: tag })}
                />
                
                {/* Create new tag option */}
                {tagInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => addTagToSelection({ name: tagInput })}
                    disabled={selectedTags.find((t) => t.name === tagInput) !== undefined}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 flex items-center justify-between border-t border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-medium">#</span>
                      <span className="font-medium text-zinc-700">{tagInput}</span>
                    </div>
                    <span className="text-gray-400 text-sm">创建新标签</span>
                  </button>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowTagModal(false)}>
                取消
              </Button>
              <Button
                type="button"
                onClick={saveSelectedTags}
                disabled={selectedTags.length === 0}
                className="harbor-button"
              >
                保存标签 ({selectedTags.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Toolbar */}
      <div className="px-4 py-1 border-t border-gray-100 bg-gray-50 leading-3 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          {/* Left: Formatting Tools */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("bold")} className="p-1 h-8 w-8" disabled={true}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText("italic")}
              disabled={true}
              className="p-1 h-8 w-8 hidden sm:flex"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText("underline")}
              disabled={true}
              className="p-1 h-8 w-8"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText("strikethrough")}
              disabled={true}
              className="p-1 h-8 w-8 "
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText("link")}
              disabled={true}
              className="p-1 h-8 w-8 hidden sm:flex"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText("mention")}
              disabled={true}
              className="p-1 h-8 w-8 "
            >
              <AtSign className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={true}
              className="p-1 h-8 w-8 "
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={true}
              className="p-1 h-8 w-8 "
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={true}
              className="h-8 px-2 text-xs"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Status and Collapse */}
          <div className="flex items-center space-x-3"></div>
        </div>
      </div>
    </div>
  )
}
