export default function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 md:px-6 py-2 message-enter">
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold mr-3 shrink-0 shadow-lg shadow-amber-500/20">
        R
      </div>
      <div className="glass rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-2">
        <span
          className="w-2 h-2 bg-amber-400 rounded-full pulse-dot"
        />
        <span
          className="w-2 h-2 bg-amber-400 rounded-full pulse-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-2 h-2 bg-amber-400 rounded-full pulse-dot"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
