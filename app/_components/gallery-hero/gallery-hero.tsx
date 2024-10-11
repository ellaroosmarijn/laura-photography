import { ChevronDown } from "lucide-react"
import styles from "./gallery-hero.module.css"

type GalleryHeroProps = {
  alt: string
  src: string
  title: string
  subtitle: string
}

export function GalleryHero({ alt, src, title, subtitle }: GalleryHeroProps) {
  return (
    <div className={styles.heroContainer}>
      <img className={styles.image} alt={alt} src={src} />
      <div>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
      <ChevronDown />
    </div>
  )
}
