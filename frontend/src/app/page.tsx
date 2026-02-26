"use client";

import ChatPanel from "@/components/layout/ChatPanel";

export default function Home() {
  return (
    <main className="flex justify-center h-screen bg-[#ffff]">
      <div className="w-[60%] h-full flex flex-col">
        <ChatPanel />
      </div>
    </main>
  );
}
