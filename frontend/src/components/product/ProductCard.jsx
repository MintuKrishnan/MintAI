import { useState } from 'react'
import { formatPrice } from '../../constants/currencies'
import { getPlaceholder, PLATFORM_COLORS } from '../../constants/platforms'

const ProductCard = ({ product, theme }) => {
  const [imgError, setImgError] = useState(false)

  const platform   = product.platform?.toLowerCase() ?? ''
  const badgeColor = PLATFORM_COLORS[platform] ?? theme.accent
  const imgSrc     = (imgError || !product.image_url) ? getPlaceholder(product.title) : product.image_url

  return (
    <a
      href={product.product_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 no-underline"
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      {/* Image — 3:2 ratio */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '66%' }}>
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
          style={{ background: badgeColor, boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}
        >
          {product.platform}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col p-3 gap-1.5 flex-1">
        <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: theme.text }}>
          {product.title}
        </p>
        <p className="text-[11px] leading-relaxed line-clamp-2 flex-1" style={{ color: theme.textSub }}>
          {product.description}
        </p>
        <div
          className="flex items-center justify-between pt-2 mt-auto"
          style={{ borderTop: `1px solid ${theme.border}` }}
        >
          <span className="text-sm font-bold" style={{ color: theme.accent }}>
            {formatPrice(product.price, product.currency)}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: theme.accent + '1a', color: theme.accent }}
          >
            View →
          </span>
        </div>
      </div>
    </a>
  )
}

export default ProductCard
