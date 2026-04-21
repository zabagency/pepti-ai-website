const SOLAS_CATALOG = [
  { keywords: ['tessa'], url: 'https://solasscience.shop/product/tesm-10-mg/ref/20/' },
  { keywords: ['bac water', 'bacteriostatic'], url: 'https://solasscience.shop/product/bac-water-30ml/ref/20/' },
  { keywords: ['nad+', 'nad plus', 'nad '], url: 'https://solasscience.shop/product/nad-500mg-buffered/ref/20/' },
  { keywords: ['semax'], url: 'https://solasscience.shop/product/semax-10/ref/20/' },
  { keywords: ['selank'], url: 'https://solasscience.shop/product/selank-10/ref/20/' },
  { keywords: ['cjc', 'ipamorelin', 'ipa'], url: 'https://solasscience.shop/product/cjc-ipa-no-dac-5-5mg/ref/20/' },
  { keywords: ['mt2', 'melanotan'], url: 'https://solasscience.shop/product/mt2-10/ref/20/' },
  { keywords: ['ghk', 'ghkcu', 'ghk-cu'], url: 'https://solasscience.shop/product/ghkcu-100/ref/20/' },
  { keywords: ['klow'], url: 'https://solasscience.shop/product/klow-80/ref/20/' },
  { keywords: ['glp-tz', 'tirzepatide'], url: 'https://solasscience.shop/product/glp-tz/ref/20/' },
  { keywords: ['glp-rt', 'retatrutide'], url: 'https://solasscience.shop/product/glp-rt/ref/20/' },
]

export function getSolasLink(peptideName) {
  if (!peptideName) return null
  const normalized = peptideName.toLowerCase()
  const match = SOLAS_CATALOG.find(product =>
    product.keywords.some(kw => normalized.includes(kw))
  )
  return match ? match.url : null
}
