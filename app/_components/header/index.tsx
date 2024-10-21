import { ArrowDownToLine, CornerUpRight, Heart, UserRound } from "lucide-react"
import Link from "next/link"
import styles from ".//index.module.css"
import { Tooltip } from "components/tooltip"

const links = [
  { name: "Gallery", path: "#" },
  { name: "Highlights", path: "#" },
  { name: "The Preparations", path: "#" },
  { name: "The Ceremony", path: "#" },
]

export function Header() {
  return (
    <header className={styles.header}>
      <Link
        className={styles.logo}
        href={"https://www.laurarosemaryphotography.co.uk/"}
      >
        Photos by Laura Rosemary Photography
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {links.map((link, index) => (
            <li key={index}>
              <Link href={link.path} className={styles.link}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.icons}>
        <ArrowDownToLine strokeWidth={0.8} />
        <CornerUpRight strokeWidth={0.8} />
        <Heart strokeWidth={0.8} />
        <div className={styles.divider} />
        <UserRound strokeWidth={0.8} />
      </div>
    </header>
  )
}
