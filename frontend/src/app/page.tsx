"use client";

import ChatPanel from "@/components/layout/ChatPanel";

export default function Home() {
  return (
        <main className="flex justify-center h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col px-0 sm:px-4 md:px-6 lg:px-8">
        <ChatPanel />
      </div>
    </main>
  );
}
