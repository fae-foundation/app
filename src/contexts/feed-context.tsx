"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { TagFilterProvider } from "./tag-filter-context";

export type FeedViewMode = "list" | "masonry";

interface FeedContextValue {
  viewMode: FeedViewMode;
  setViewMode: (mode: FeedViewMode) => void;
}

const FeedContext = createContext<FeedContextValue | undefined>(undefined);

interface FeedProviderProps {
  children: ReactNode;
  initialViewMode?: FeedViewMode;
}

export function FeedProvider({ children, initialViewMode = "list" }: FeedProviderProps) {
  const [viewMode, setViewMode] = useState<FeedViewMode>(initialViewMode);

  return (
    <TagFilterProvider>
      <FeedContext.Provider value={{ viewMode, setViewMode }}>
        {children}
      </FeedContext.Provider>
    </TagFilterProvider>
  );
}

export function useFeedContext() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeedContext must be used within a FeedProvider");
  }
  return context;
} 