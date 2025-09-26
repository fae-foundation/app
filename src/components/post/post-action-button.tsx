"use client";

import { ReactElement, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";
import { useTheme } from "next-themes";

export type DropdownItem = {
  icon: any;
  label: string;
  onClick: () => void;
};

export type ActionButtonProps = {
  icon: any;
  label: string;
  initialCount: number;
  strokeColor: string;
  fillColor: string;
  isActive?: boolean;
  onClick?: () => Promise<any> | void;
  renderPopover?: (trigger: ReactElement) => ReactElement;
  isDisabled?: boolean;
  isUserLoggedIn?: boolean;
  dropdownItems?: DropdownItem[];
  hideCount?: boolean;
  className?: string;
  showChevron?: boolean;
  fillOnHover?: boolean;
  fillOnClick?: boolean;
};

const TooltipWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="bg-foreground text-background text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  if (!num) return "";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
};

export const ActionButton = ({
  icon: Icon,
  label,
  initialCount,
  strokeColor,
  fillColor,
  isActive = false,
  onClick,
  renderPopover,
  isDisabled = false,
  isUserLoggedIn,
  dropdownItems,
  hideCount = false,
  className,
  showChevron = false,
  fillOnClick = true,
}: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { checkAuthentication } = useAuthCheck();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const showLoginActions = !isUserLoggedIn;
  const formattedCount = formatNumber(initialCount);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showLoginActions) {
      if (!checkAuthentication(label)) {
        return;
      }
    }

    if (isDisabled || !onClick) return;
    try {
      await onClick();
    } catch (error) {
      console.error(`Action button "${label}" failed:`, error);
    }
  };

  const baseGray = isDarkMode ? "#E5E7EB" : "#4B5563";
  const iconColor = isDisabled ? baseGray : (isActive ? strokeColor : baseGray);
  const iconOpacity = isDisabled ? 0.5 : 1;
  const cursorStyle = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
  const opacityClass = isDisabled ? "opacity-70" : "";

  // 激活时填充
  const isBookmark = label === "Bookmark";
  const isLike = label === "Like";
  const iconFill = (isBookmark || isLike) && isActive ? iconColor : undefined;

  const iconProps = {
    size: 16, // 调小图标尺寸
    strokeWidth: 2,
    className: "transition-all duration-200",
    style: {
      color: iconColor,
      fill: iconFill,
      opacity: iconOpacity,
    },
  };

  const MainButton = (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "flex items-center touch-manipulation min-h-[36px] min-w-[36px] px-2 h-8", // 调小按钮尺寸
        // 背景色效果
        "bg-transparent",
        "hover:bg-muted/30", // hover时轻微加深
        isActive && "bg-muted/50 hover:bg-muted/60", // 激活时更深，hover时更深
        className
      )}
    >
      <Icon {...iconProps} />
      {!(label === "Bookmark" || label === "Share") && formattedCount && (
        <span className="text-xs font-bold ml-1 min-w-fit text-foreground">
          {formattedCount}
        </span>
      )}
    </button>
  );

  const divWrapperClassName = cn(
    "group flex items-center touch-manipulation",
    cursorStyle,
    opacityClass,
    className
  );

  const TooltipWrapper = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (dropdownItems && dropdownItems.length > 0) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className={divWrapperClassName}>
            <TooltipWrapper>{MainButton}</TooltipWrapper>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top">
          {dropdownItems.map((item) => (
            <DropdownMenuItem 
              key={item.label} 
              onClick={item.onClick} 
              className="gap-2 cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={divWrapperClassName}>
      <TooltipWrapper>{MainButton}</TooltipWrapper>
    </div>
  );
};