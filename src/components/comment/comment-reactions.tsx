"use client";

import { AnyPost } from "@lens-protocol/client";
import { Heart, MessageCircle } from "lucide-react";
import { usePostActions } from "@/hooks/post-actions/use-post-actions";
import { Button } from "../ui/button";

interface CommentReactionsProps {
  comment: AnyPost;
  onShowReplies?: () => void;
  hasReplies?: boolean;
  isLoadingReplies?: boolean;
}

export const CommentReactions = ({
  comment,
  onShowReplies,
  hasReplies = false,
  isLoadingReplies = false,
}: CommentReactionsProps) => {
  // Only use post actions if it's a Post type
  const { handleLike, stats, operations, isLoggedIn } = usePostActions(
    comment.__typename === "Post" ? comment : null
  );
  const hasUpvoted = operations?.hasUpvoted;

  const handleShowReplies = async () => {
    onShowReplies?.();
    return undefined;
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={!isLoggedIn}
        className={`flex items-center gap-1 transition-colors ${
          hasUpvoted 
            ? "text-red-500 dark:text-red-400" 
            : "hover:text-red-500 dark:hover:text-red-400"
        } `}
      >
        <Heart className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`} />
        {stats?.upvotes || 0}
      </Button>
      
      {hasReplies && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowReplies}
          disabled={!hasReplies || isLoadingReplies}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-black dark:text-white"
        >
          <MessageCircle className="w-4 h-4" />
          {isLoadingReplies ? "Loading..." : stats?.comments || 0}
        </Button>
      )}
    </div>
  );
};
