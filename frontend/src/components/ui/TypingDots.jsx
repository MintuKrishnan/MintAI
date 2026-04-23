const TypingDots = ({ accent }) => (
  <div className="flex items-center gap-1.5 px-4 py-3.5">
    {[0, 200, 400].map(delay => (
      <span
        key={delay}
        className="typing-dot block w-2 h-2 rounded-full"
        style={{ background: accent, animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
)

export default TypingDots
