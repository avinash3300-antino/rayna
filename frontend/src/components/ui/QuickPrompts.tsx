"use client";

const PROMPTS = [
  { text: "Show me Dubai tours", icon: "🏙️" },
  { text: "Desert safari tours in Dubai", icon: "🐪" },
  { text: "Water activities in Dubai", icon: "🏄" },
  { text: "Dubai city tour packages", icon: "🚌" },
  { text: "Burj Khalifa tickets", icon: "🏒" },
  { text: "What destinations do you cover?", icon: "🌍" },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
        <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
      {/* Logo */}
      <div className="w-20 sm:w-24 md:w-28 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
        <img src="/raynatourslogo.webp" alt="Rayna Tours Logo" className="w-full h-auto" />
      </div>

      {/* <h3 className="text-xl font-semibold text-black mb-1">
        Hi! I&apos;m Rayna
      </h3> */}
                        <p className="text-sm text-[var(--text-primary)] mb-6 sm:mb-8 text-center max-w-sm px-4">
        Your AI travel assistant specializing in Dubai & UAE tours! Ask me about tours and activities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg px-4">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-2 sm:gap-3 text-left text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl glass glass-hover transition-all text-[var(--text-primary)] hover:text-amber-500 group"
          >
                        <span className="text-base sm:text-lg group-hover:scale-110 transition-transform flex-shrink-0">
              {prompt.icon}
            </span>
            <span className="break-words">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
