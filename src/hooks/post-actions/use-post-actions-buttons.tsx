"use client";

import { Post } from "@lens-protocol/client";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import React, { JSXElementConstructor, ReactElement } from "react";
import { usePostActions } from "@/hooks/post-actions/use-post-actions";
import { useRouter } from "next/navigation";

// 自定义图标组件，用于显示emoji
const EmojiIcon = ({ emoji, size = 18, ...props }: { emoji: string; size?: number; [key: string]: any }) => (
  <span style={{ fontSize: size, lineHeight: 1 }} {...props}>
    {emoji}
  </span>
);

type ActionButtonConfig = {
  icon:any;
  label: string;
  initialCount: number;
  strokeColor: string;
  fillColor: string;
  isActive?: boolean;
  shouldIncrementOnClick: boolean;
  onClick?: () => Promise<any> | void;
  renderPopover?: (
    trigger: ReactElement<any, string | JSXElementConstructor<any>>,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  isDisabled?: boolean;
  dropdownItems?: {
    icon: any;
    label: string;
    onClick: () => void;
  }[];
  hideCount?: boolean;
  isUserLoggedIn?: boolean;
  onConnectWallet?: () => void;
  onSelectProfile?: () => void;
};

type PostActionButtons = {
  likeButton: ActionButtonConfig;
  commentButton: ActionButtonConfig;
  bookmarkButton: ActionButtonConfig;
  shareButton: ActionButtonConfig;
};

export const usePostActionsButtons = ({
  post,
}: {
  post: Post;
}): PostActionButtons => {
  const router = useRouter();
  const {
    //handleComment,
    handleBookmark,
    handleLike,
    //isCommentSheetOpen,
    stats,
    operations,
    isLoggedIn,
  } = usePostActions(post);

  // 检测post类型并返回相应的图标
  const getPostTypeIcon = () => {
    const tags = "tags" in post.metadata && Array.isArray(post.metadata.tags) 
      ? post.metadata.tags 
      : [];
    
    if (tags.includes("cook")) {
      return "🍪";
    } else if (tags.includes("moment")) {
      return "🩵";
    }
    return null; // 默认不显示图标
  };

  const postTypeIcon = getPostTypeIcon();

  const handleComment = () => {
    router.push(`/p/${post.id}`);
    /*
    // 延迟滚动到评论区域，确保页面已加载
    setTimeout(() => {
      const commentSection = document.getElementById('comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500);
    */
  };

  const likes = stats.upvotes;
  const comments = stats.comments;
  const bookmarks = stats.bookmarks;

  const hasUpvoted = operations?.hasUpvoted;
  const hasBookmarked = operations?.hasBookmarked;

  const buttons: PostActionButtons = {
    likeButton: {
      icon: postTypeIcon ? (props: any) => <EmojiIcon emoji={postTypeIcon} {...props} /> : Heart,
      label: "Like",
      initialCount: likes,
      strokeColor: "#ef4444", 
      fillColor: "none",
      onClick: handleLike,
      isActive: hasUpvoted,
      shouldIncrementOnClick: true,
      isDisabled: false,
      isUserLoggedIn: isLoggedIn,
    },
    commentButton: {
      icon: MessageCircle,
      label: "Comment",
      initialCount: comments,
      strokeColor: "#3b82f6", 
      fillColor: "none",
      onClick: handleComment,
      shouldIncrementOnClick: false,
      isDisabled: false,
      isUserLoggedIn: isLoggedIn,
    },
    bookmarkButton: {
      icon: Bookmark,
      label: "Bookmark",
      isActive: hasBookmarked,
      initialCount: bookmarks,
      strokeColor: "#10b981", 
      fillColor: "none",
      shouldIncrementOnClick: true,
      onClick: handleBookmark,
      isDisabled: false,
      isUserLoggedIn: isLoggedIn,
    },
    shareButton: {
      icon: Share2,
      label: "Share",
      isActive: false,
      initialCount: 0,
      strokeColor: "#6b7280", 
      fillColor: "none",
      shouldIncrementOnClick: false,
      hideCount: true,
      isUserLoggedIn: isLoggedIn,
      dropdownItems: [
        {
          icon: Share2,
          label: "Copy Link",
          onClick: () => {
            // TODO: Implement copy link functionality
            console.log("Copy link clicked");
          },
        },
      ],
    },
  };

  return buttons;
};