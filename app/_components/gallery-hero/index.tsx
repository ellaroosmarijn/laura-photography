import { ChevronDown } from "lucide-react"
import styles from "./index.module.css"
import Link from "next/link"

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
      <div className={styles.textOverlay}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subtitle}>{subtitle}</h2>
      </div>
      {/* // TODO: make chevron clickable, and direct you to beginning of 
      the highlights section */}
      <Link href="">
        <ChevronDown className={styles.chevron} strokeWidth={0.5} />
      </Link>
    </div>
  )
}