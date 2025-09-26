"use client";

import { createContext, ReactNode, useContext, useState, useCallback } from "react";

export interface TagFilter {
  presetTags: string[]; // 来自FilterDialog的预设标签
  customTags: string[]; // 来自SearchDialog的自定义标签
  allTags: string[]; // 所有标签的合并
  searchQuery?: string; // 内容搜索查询
}

interface TagFilterContextValue {
  tagFilter: TagFilter;
  addPresetTag: (tag: string) => void;
  removePresetTag: (tag: string) => void;
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  setSearchQuery: (query: string | undefined) => void;
  clearAllTags: () => void;
  clearPresetTags: () => void;
  clearCustomTags: () => void;
  clearSearchQuery: () => void;
  hasActiveFilters: boolean;
}

const TagFilterContext = createContext<TagFilterContextValue | undefined>(undefined);

interface TagFilterProviderProps {
  children: ReactNode;
}

export function TagFilterProvider({ children }: TagFilterProviderProps) {
  const [presetTags, setPresetTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // 计算所有标签
  const allTags = [...new Set([...presetTags, ...customTags])];

  const addPresetTag = useCallback((tag: string) => {
    setPresetTags(prev => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  const removePresetTag = useCallback((tag: string) => {
    setPresetTags(prev => prev.filter(t => t !== tag));
  }, []);

  const addCustomTag = useCallback((tag: string) => {
    setCustomTags(prev => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  const removeCustomTag = useCallback((tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  }, []);

  const clearAllTags = useCallback(() => {
    setPresetTags([]);
    setCustomTags([]);
  }, []);

  const clearPresetTags = useCallback(() => {
    setPresetTags([]);
  }, []);

  const clearCustomTags = useCallback(() => {
    setCustomTags([]);
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery(undefined);
  }, []);

  const hasActiveFilters = allTags.length > 0 || !!searchQuery;

  const tagFilter: TagFilter = {
    presetTags,
    customTags,
    allTags,
    searchQuery,
  };

  const value: TagFilterContextValue = {
    tagFilter,
    addPresetTag,
    removePresetTag,
    addCustomTag,
    removeCustomTag,
    setSearchQuery,
    clearAllTags,
    clearPresetTags,
    clearCustomTags,
    clearSearchQuery,
    hasActiveFilters,
  };

  return (
    <TagFilterContext.Provider value={value}>
      {children}
    </TagFilterContext.Provider>
  );
}

export function useTagFilter() {
  const context = useContext(TagFilterContext);
  if (!context) {
    throw new Error("useTagFilter must be used within a TagFilterProvider");
  }
  return context;
}
