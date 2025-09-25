import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Tag {
  name: string;
}

interface TagDisplayProps {
  tags: Tag[] | string[];
  onRemove?: (tagName: string) => void;
  onTagClick?: (tagName: string) => void;
  showRemoveButton?: boolean;
  className?: string;
}

export function TagDisplay({ 
  tags, 
  onRemove, 
  onTagClick,
  showRemoveButton = false,
  className = ""
}: TagDisplayProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  if (!tags || tags.length === 0) {
    return null;
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tagName: string) => {
    if (pathname?.includes('/p/')) {
      router.back();
    } else {
      handleScrollToTop();
    }
    
    onTagClick?.(tagName);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        
        return (
          <Badge
            key={`${tagName}-${index}`}
            variant="secondary"
            className={`flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-normal bg-slate-50 dark:bg-slate-800 text-sm ${onTagClick ? 'cursor-pointer' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTagClick(tagName);
            }}
          >
            #{tagName}
            {showRemoveButton && onRemove && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tagName);
                }} 
                className="hover:text-red-500 dark:hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        );
      })}
    </div>
  );
}
