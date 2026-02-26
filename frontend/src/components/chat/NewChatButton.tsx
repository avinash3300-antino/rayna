"use client";

interface NewChatButtonProps {
  onClear: () => void;
  disabled: boolean;
}

export default function NewChatButton({ onClear, disabled }: NewChatButtonProps) {
  return (
    <button
      onClick={() => !disabled && onClear()}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm text-black hover:text-amber-400 disabled:opacity-30 transition-all px-3 py-1.5 rounded-lg glass glass-hover"
      title="New chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      New Chat
    </button>
  );
}
