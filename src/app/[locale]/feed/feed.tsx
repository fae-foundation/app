"use client";

import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { PostList } from "@/components/feed/post-list";
import { useFeed } from "@/hooks/use-feed";
import { FeedHeader } from "@/components/feed/feed-header";
import { useFeedContext } from "@/contexts/feed-context";
import { FeedFloatingActions } from "@/components/feed/feed-floating-actions";
import { ArrowUp } from "lucide-react";

export function Feed() {
  const { viewMode } = useFeedContext();
  const {
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    refreshing,
    newPostsAvailable,
    lastRefreshTime,
    handleRefresh,
    handleLoadMore,
    handleLoadNewPosts,
  } = useFeed();

  return (
    <TooltipProvider>
      <div className={`${viewMode === 'list' ? 'max-w-xl' : 'max-w-5xl'} mx-auto space-y-3`}>
        {/* 出错提示 */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {/* 新帖子提示-暂时不使用 */}
        {/*newPostsAvailable && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={handleLoadNewPosts}
              className="bg-harbor-600 hover:bg-harbor-700 text-white shadow-lg animate-bounce"
              size="sm"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              New posts available
            </Button>
          </div>
        )}
        {/* 帖子导航栏 */}
        <div className="text-center">
          <FeedHeader />
        </div>
        {/* 帖子列表 */}
        <PostList
          posts={posts || []}
          loading={loading || loadingMore}
          emptyText="No More"
          skeletonCount={4}
        />
        {/* 自动加载 */}
        {loadingMore && (
          <div className="flex justify-center mt-6 mb-12">
            <Button
              onClick={handleLoadMore}
              className="bg-gray-500 text-white shadow-lg animate-bounce"
              size="sm"
            >
              Loading ...
            </Button>
          </div>
        )}
        {/* 浮动操作栏 */}
        <FeedFloatingActions
          onRefresh={handleRefresh}
          refreshing={refreshing}
          lastRefreshTime={lastRefreshTime}
        />
      </div>
    </TooltipProvider>
  );
}
