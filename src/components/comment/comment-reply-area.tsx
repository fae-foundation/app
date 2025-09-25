"use client";

import { AnyPost } from "@lens-protocol/client";
import { post as createPost } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";
import { useState } from "react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLensAuthStore } from "@/stores/auth-store";
import { storageClient } from "@/lib/storage-client";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";

interface CommentReplyAreaProps {
  postId: string;
  onSubmit?: (content: string) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  isCompact?: boolean;
}

export const CommentReplyArea = ({
  postId,
  onSubmit,
  onCancel,
  disabled,
  isCompact = false,
}: CommentReplyAreaProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sessionClient } = useLensAuthStore();
  const { data: walletClient } = useWalletClient();
  const { checkAuthentication } = useAuthCheck();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    if (!checkAuthentication("comment")) {
      return;
    }

    setIsSubmitting(true);
    const pendingToast = toast.loading("Publishing comment...");

    try {
      // Create metadata for the comment
      const metadata = textOnly({
        content: content.trim(),
      });

      // Upload metadata to storage
      const { uri } = await storageClient.uploadAsJson(metadata);

      // Create comment using Lens Protocol
      const result = await createPost(sessionClient!, {
        contentUri: uri,
        commentOn: {
          post: postId,
        },
      })
        .andThen(handleOperationWith(walletClient))
        .andThen(sessionClient!.waitForTransaction);

      if (result.isErr()) {
        toast.dismiss(pendingToast);
        toast.error("Failed to publish comment", {
          description: result.error instanceof Error ? result.error.message : "An unknown error occurred",
        });
        console.error("Error publishing comment:", result.error);
        return;
      }

      toast.dismiss(pendingToast);
      toast.success("Comment published successfully!");

      setContent("");

      if (onSubmit) {
        await onSubmit(content.trim());
      }
    } catch (error) {
      console.error("Error publishing comment:", error);
      toast.dismiss(pendingToast);
      toast.error("Error publishing comment", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <div className={`p-4 border border-border rounded-sm bg-background ${isCompact ? "mb-0" : ""}`}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Textarea
            placeholder="Add your comment here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={disabled || isSubmitting}
            className="resize-none flex-grow min-h-[60px]"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        <div className="flex justify-end items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={handleCancel} 
            disabled={disabled || isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || disabled || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
};
