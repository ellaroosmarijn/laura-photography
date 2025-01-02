"use client"

import { ArrowDownToLine, CornerUpRight, Heart, UserRound } from "lucide-react"
import classnames from "classnames/bind"
import Link from "next/link"
import styles from "./index.module.css"
import { Tooltip } from "components/tooltip"
import { Dropdown } from "components/dropdown"
import { useEffect, useRef } from "react"

const cx = classnames.bind(styles)

const links = [
  { name: "Gallery", path: "#" },
  { name: "Highlights", path: "#" },
  { name: "The Preparations", path: "#" },
  { name: "The Ceremony", path: "#" },
  { name: "I'm a tester", path: "#" },
  { name: "HElloooo", path: "#" },
  { name: "blahhhhhhhh", path: "#" },
  { name: "djbkliuhIUBHDUIUH", path: "#" },
]

export function Header() {
  const navRef = useRef(null)

  useEffect(() => {
    if (navRef.current) {
      const navRightPosition = navRef.current.getBoundingClientRect().right
    }
  }, [])

  return (
    <header className={styles.header}>
      <Link
        className={styles.logo}
        href={"https://www.laurarosemaryphotography.co.uk/"}
      >
        Photos by Laura Rosemary Photography
      </Link>
      <nav className={styles.nav} ref={navRef}>
        <ul className={styles.ul}>
          {links.map((link, index) => (
            <li className={styles.listItem} key={index}>
              <Link
                href={link.path}
                className={cx(styles.link, styles.truncatedLink)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.icons}>
        <Tooltip text="Download Photos" direction="bottom">
          <ArrowDownToLine
            strokeWidth={0.8}
            stroke="var(--color-charcoal-light)"
          />
        </Tooltip>
        <Tooltip text="Share Photos" direction="bottom">
          <CornerUpRight
            strokeWidth={0.8}
            stroke="var(--color-charcoal-light)"
          />
        </Tooltip>
        <Tooltip text="Favourites" direction="bottom">
          <Heart strokeWidth={0.8} stroke="var(--color-charcoal-light)" />
        </Tooltip>
        <div className={styles.divider} />
        <Tooltip text="My Account" direction="left">
          <UserRound strokeWidth={0.8} stroke="var(--color-charcoal-light)" />
        </Tooltip>
      </div>
    </header>
  )
}
