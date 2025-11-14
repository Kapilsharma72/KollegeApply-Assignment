const images = import.meta.glob('../assests/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default'
})

function normalize(str = ''){
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function resolveUniImage(uni){
  if (!uni) return ''
  const slug = normalize(uni.slug || '')
  const name = normalize(uni.name || '')
  const rawName = String(uni.name || '').toLowerCase().trim()

  const candidates = []
  const exts = ['jpg','jpeg','png','webp','svg']
  for (const ext of exts){
    candidates.push(`../assests/${slug}.${ext}`)
    candidates.push(`../assests/${name}.${ext}`)
    candidates.push(`../assests/Universities images/${uni.name}.${ext}`)
    candidates.push(`../assests/Universities images/${rawName}.${ext}`)
    candidates.push(`../assests/universities/${slug}.${ext}`)
    candidates.push(`../assests/universities/${name}.${ext}`)
  }

  for (const key of candidates){
    if (images[key]) return images[key]
  }

  const match = Object.keys(images).find(k => {
    const low = k.toLowerCase()
    return (
      (slug && low.includes(`/${slug}.`)) ||
      (name && low.includes(`/${name}.`)) ||
      (rawName && low.includes(`/${rawName}.`))
    )
  })
  if (match) return images[match]

  return uni.heroImage || ''
}
