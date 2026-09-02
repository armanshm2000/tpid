"use client";

import { signOut } from "next-auth/react";

export function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white pl-12 lg:pl-0">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">Titan Project Intelligence Dashboard v1.0</span>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Sign out</button>
      </div>
    </header>
  );
}
