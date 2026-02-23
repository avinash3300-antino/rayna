"use client";

import ChatPanel from "@/components/layout/ChatPanel";

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <div className="w-full">
        <ChatPanel />
      </div>
    </main>
  );
}
