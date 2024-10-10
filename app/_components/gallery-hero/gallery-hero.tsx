type GalleryHeroProps = {
  alt: string
  src: string
  title: string
  subtitle: string
}

export function GalleryHero({ alt, src, title, subtitle }: GalleryHeroProps) {
  return (
    <div>
      <img alt={alt} src={src} />
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  )
}
