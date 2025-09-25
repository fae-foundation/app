import { Post, PostReactionType } from "@lens-protocol/client";
import { addReaction, bookmarkPost, undoBookmarkPost, undoReaction } from "@lens-protocol/client/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useSharedPostActions } from "@/contexts/post-actions-context";
import { LoggedInPostOperations } from "@lens-protocol/client";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";

// Helper function to convert LoggedInPostOperations to BooleanPostOperations
const convertToBooleanOperations = (operations: LoggedInPostOperations) => {
  return {
    hasUpvoted: operations.hasUpvoted,
    hasBookmarked: operations.hasBookmarked,
    hasReposted: operations.hasReposted.optimistic,
    hasQuoted: operations.hasQuoted.optimistic,
    canComment: operations.canComment.__typename === "PostOperationValidationPassed",
    canRepost: operations.canRepost.__typename === "PostOperationValidationPassed",
    canQuote: operations.canQuote.__typename === "PostOperationValidationPassed",
    canBookmark: true,
    canCollect: operations.canSimpleCollect.__typename === "SimpleCollectValidationPassed",
    canTip: operations.canTip,
    canDelete: operations.canDelete?.__typename === "PostOperationValidationPassed",
  };
};
import { useLensAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { resolveUrl } from "@/utils/resolve-url";

// For single post actions
export const usePostActions = (post: Post | null) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPostState, initPostState, updatePostState, updatePostStats, updatePostOperations } =
    useSharedPostActions();

  const { sessionClient, currentProfile, loading } = useLensAuthStore();
  const { isAuthenticated } = useAuthCheck();

  useEffect(() => {
    if (post) {
      // Pass the post.operations if available, otherwise let initPostState handle it
      initPostState(post, post.operations || undefined);
    }
  }, [post, initPostState]);
  
  const sharedState = post ? getPostState(post.id) : undefined;

  const defaultOperations = {
    hasUpvoted: false,
    hasBookmarked: false,
    hasReposted: false,
    hasQuoted: false,
    canComment: false,
    canRepost: false,
    canQuote: false,
    canBookmark: false,
    canCollect: false,
    canDelete: false,
    canTip: false,
  };

  const { stats, operations, isCommentSheetOpen, isCollectSheetOpen } = useMemo(
    () => ({
      stats: sharedState?.stats ?? post?.stats ?? { upvotes: 0, downvotes: 0, comments: 0, mirrors: 0, quotes: 0, bookmarks: 0, collects: 0 },
      operations: sharedState?.operations ?? (post?.operations ? convertToBooleanOperations(post.operations) : defaultOperations),
      isCommentSheetOpen: sharedState?.isCommentSheetOpen ?? false,
      isCollectSheetOpen: sharedState?.isCollectSheetOpen ?? false,
    }),
    [sharedState, post?.stats, post?.operations, defaultOperations],
  );

  const isCommentOpenParam = useMemo(
    () => post && searchParams.has("comment") && searchParams.get("comment") === post.slug,
    [searchParams, post?.slug],
  );
  const isCollectOpenParam = useMemo(
    () => post && searchParams.has("collect") && searchParams.get("collect") === post.slug,
    [searchParams, post?.slug],
  );

  useEffect(() => {
    if (post && sharedState && !sharedState.initialCommentUrlSynced) {
      const shouldOpen = isCommentOpenParam;
      if (shouldOpen && !sharedState.isCommentSheetOpen) {
        updatePostState(post.id, { isCommentSheetOpen: true, initialCommentUrlSynced: true });
      } else {
        updatePostState(post.id, { initialCommentUrlSynced: true });
      }
    }
  }, [isCommentOpenParam, post?.id, sharedState, updatePostState]);

  useEffect(() => {
    if (post && sharedState && !sharedState.initialCollectUrlSynced) {
      const shouldOpen = isCollectOpenParam;
      if (shouldOpen && !sharedState.isCollectSheetOpen) {
        updatePostState(post.id, { isCollectSheetOpen: true, initialCollectUrlSynced: true });
      } else {
        updatePostState(post.id, { initialCollectUrlSynced: true });
      }
    }
  }, [isCollectOpenParam, post?.id, sharedState, updatePostState]);

  const handleComment = useCallback(
    async (redirectToPost?: boolean) => {
      if (!post) return;
      
      if (redirectToPost) {
        window.location.href = `${resolveUrl(post.slug)}?comment=${post.slug}`;
        return;
      }

      const newOpenState = !isCommentSheetOpen;

      updatePostState(post.id, { isCommentSheetOpen: newOpenState });

      const params = new URLSearchParams(searchParams);
      if (!newOpenState) {
        params.delete("comment");
      } else {
        params.set("comment", post.slug);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [post?.id, post?.author.username?.localName, post?.slug, isCommentSheetOpen, updatePostState, router, searchParams],
  );

  const handleCollect = useCallback(async () => {
    if (!post) return;
    
    const newOpenState = !isCollectSheetOpen;
    updatePostState(post.id, { isCollectSheetOpen: newOpenState });

    const params = new URLSearchParams(searchParams);
    if (!newOpenState) {
      params.delete("collect");
    } else {
      params.set("collect", post.slug);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [post?.id, post?.slug, isCollectSheetOpen, updatePostState, router, searchParams]);

  const handleCommentSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!post) return;
      
      if (isCommentSheetOpen !== open) {
        updatePostState(post.id, { isCommentSheetOpen: open });
      }

      const params = new URLSearchParams(searchParams);
      const currentParam = params.get("comment");
      if (!open && currentParam === post.slug) {
        params.delete("comment");
        router.replace(`?${params.toString()}`, { scroll: false });
      } else if (open && currentParam !== post.slug) {
        params.set("comment", post.slug);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [post?.id, post?.slug, isCommentSheetOpen, updatePostState, router, searchParams],
  );

  const handleCollectSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!post) return;
      
      if (isCollectSheetOpen !== open) {
        updatePostState(post.id, { isCollectSheetOpen: open });
      }

      const params = new URLSearchParams(searchParams);
      const currentParam = params.get("collect");
      if (!open && currentParam === post.slug) {
        params.delete("collect");
        router.replace(`?${params.toString()}`, { scroll: false });
      } else if (open && currentParam !== post.slug) {
        params.set("collect", post.slug);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [post?.id, post?.slug, isCollectSheetOpen, updatePostState, router, searchParams],
  );

  const handleBookmark = useCallback(async () => {
    // Return early if user is not logged in or post is null
    if (!isAuthenticated || !post) return null;

    if (!sessionClient?.isSessionClient()) {
      toast.error("Please connect your wallet to bookmark posts");
      return null;
    }

    const currentlyBookmarked = operations?.hasBookmarked || false;
    const currentCount = stats.bookmarks;

    updatePostOperations(post.id, { hasBookmarked: !currentlyBookmarked });
    updatePostStats(post.id, { bookmarks: currentlyBookmarked ? Math.max(0, currentCount - 1) : currentCount + 1 }); // Prevent negative counts

    try {
      if (currentlyBookmarked) {
        await undoBookmarkPost(sessionClient, { post: post.id });
      } else {
        await bookmarkPost(sessionClient, { post: post.id });
      }
    } catch (error) {
      console.error("Failed to handle bookmark:", error);
      updatePostOperations(post.id, { hasBookmarked: currentlyBookmarked });
      updatePostStats(post.id, { bookmarks: currentCount });
    }
  }, [post?.id, operations, stats.bookmarks, updatePostOperations, updatePostStats, isAuthenticated, sessionClient]);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated || !post) return null;

    if (!sessionClient?.isSessionClient()) {
      toast.error("Please connect your wallet to like posts");
      return null;
    }

    const currentlyLiked = operations?.hasUpvoted || false;
    const currentCount = stats.upvotes;

    updatePostOperations(post.id, { hasUpvoted: !currentlyLiked });
    updatePostStats(post.id, { upvotes: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1 }); // Prevent negative counts

    try {
      if (currentlyLiked) {
        await undoReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
      } else {
        await addReaction(sessionClient, { post: post.id, reaction: PostReactionType.Upvote });
      }
    } catch (error) {
      console.error("Failed to handle like:", error);
      updatePostOperations(post.id, { hasUpvoted: currentlyLiked });
      updatePostStats(post.id, { upvotes: currentCount });
    }
  }, [post?.id, operations, stats.upvotes, updatePostOperations, updatePostStats, isAuthenticated, sessionClient]);

  return {
    handleComment,
    handleCollect,
    handleBookmark,
    handleLike,
    isCommentSheetOpen,
    isCollectSheetOpen,
    handleCommentSheetOpenChange,
    handleCollectSheetOpenChange,
    stats,
    operations,
    isLoggedIn: isAuthenticated,
  };
};
