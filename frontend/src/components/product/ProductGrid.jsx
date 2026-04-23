import ProductCard from './ProductCard'

const ProductGrid = ({ products, theme }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div
        className="w-full py-12 flex flex-col items-center gap-3 rounded-2xl border"
        style={{ background: theme.surface, borderColor: theme.border }}
      >
        <span className="text-4xl">🔍</span>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          No products found. Try a different search.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {products.map((product, i) => (
        <ProductCard key={i} product={product} theme={theme} />
      ))}
    </div>
  )
}

export default ProductGrid
