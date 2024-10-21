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
      {/* // TODO: make links show or move into dropdown depending on screen size */}
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
        <Tooltip text="Download Photos" direction="bottom">
          <ArrowDownToLine strokeWidth={0.8} />
        </Tooltip>
        <Tooltip text="Share Photos" direction="bottom">
          <CornerUpRight strokeWidth={0.8} />
        </Tooltip>
        <Tooltip text="Favourites" direction="bottom">
          <Heart strokeWidth={0.8} />
        </Tooltip>
        <div className={styles.divider} />
        <Tooltip text="My Account" direction="bottom">
          <UserRound strokeWidth={0.8} />
        </Tooltip>
      </div>
    </header>
  )
}
