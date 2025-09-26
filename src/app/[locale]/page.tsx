"use client";

import { Feed } from "./feed/feed";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-2">
        <Feed />
      </div>
    </div>
  );
}
