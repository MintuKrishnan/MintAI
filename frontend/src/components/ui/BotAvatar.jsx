import LeafIcon from './LeafIcon'

const BotAvatar = ({ accent }) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
    style={{
      background: `linear-gradient(135deg,${accent},${accent}99)`,
      boxShadow: `0 2px 8px ${accent}44`,
    }}
  >
    <LeafIcon size={13} />
  </div>
)

export default BotAvatar
