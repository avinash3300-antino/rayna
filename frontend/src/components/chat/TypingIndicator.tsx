export default function TypingIndicator() {
  return (
        <div className="flex justify-start message-enter">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold mr-2 sm:mr-3 shrink-0 shadow-lg shadow-amber-500/20">
        R
      </div>
      <div className="glass rounded-2xl rounded-bl-sm px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 flex items-center gap-2">
                <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full pulse-dot"
        />
        <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full pulse-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full pulse-dot"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
