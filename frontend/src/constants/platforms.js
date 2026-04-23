export const PLATFORM_COLORS = {
  amazon:   '#FF9900',
  flipkart: '#2874F0',
  meesho:   '#F43397',
  myntra:   '#FF3F6C',
  snapdeal: '#E40000',
}

const GRADIENTS = [
  ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
  ['#fda085', '#f6d365'], ['#84fab0', '#8fd3f4'],
]

export const getPlaceholder = (title = '') => {
  const [c1, c2] = GRADIENTS[title.length % GRADIENTS.length]
  const initials  = title.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <text x="200" y="158" font-family="system-ui,sans-serif" font-size="88" font-weight="800"
      text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.88">${initials}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
