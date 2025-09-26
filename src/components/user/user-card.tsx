"use client";

import { Account } from "@lens-protocol/client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserCardProps {
  children: ReactNode;
  account?: Account;
  username?: string;
  linkProfile?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const UserCard = ({
  children,
  account,
  username,
  linkProfile = false,
  onClick,
  className,
}: UserCardProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
      return;
    }

    if (linkProfile) {
      const profileUsername = username || account?.username?.localName;
      if (profileUsername) {
        router.push(`/u/${profileUsername}`);
      }
    }
  };

  return (
    <div
      className={cn(
        linkProfile ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
