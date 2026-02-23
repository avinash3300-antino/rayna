"use client";

interface SidebarProps {
  onOpenChat: () => void;
}

const FEATURES = [
  {
    icon: "🌍",
    title: "50+ Destinations",
    desc: "Dubai, Singapore, Bangkok, Bali and more",
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    desc: "Smart recommendations tailored to you",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Exclusive deals and instant price comparison",
  },
  {
    icon: "⏰",
    title: "24/7 Available",
    desc: "Plan your trip anytime, anywhere",
  },
];

export default function Sidebar({ onOpenChat }: SidebarProps) {
  return (
    <div className="relative flex flex-col w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white overflow-y-auto">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/10 rounded-full" />

      <div className="relative z-10 flex flex-col justify-center flex-1 px-8 py-12 lg:px-12">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Rayna Tours
          </h1>
          <p className="text-white/70 text-sm">AI Travel Assistant</p>
        </div>

        {/* Hero text */}
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Your AI Travel
            <br />
            Companion
          </h2>
          <p className="text-white/80 text-base lg:text-lg max-w-md leading-relaxed">
            Discover tours, cruises, and holiday packages across Dubai,
            Singapore, Bangkok and many more destinations worldwide.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <span className="text-2xl mt-0.5">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-white/70 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <button
          onClick={onOpenChat}
          className="md:hidden w-full py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}
