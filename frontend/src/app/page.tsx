"use client";

import ChatPanel from "@/components/layout/ChatPanel";

export default function Home() {
  return (
    <main className="flex justify-center h-screen overflow-hidden bg-[#ffff]">
      <div className="w-[60%]">
        <ChatPanel />
      </div>
    </main>
  );
}
