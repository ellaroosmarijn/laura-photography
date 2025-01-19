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

const COLUMN_GAP_VALUE = 20
const ITEMS_PADDING_VALUE = 20

export function Header() {
  const navRef = useRef<HTMLDivElement>(null)
  const dungeonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkLinksFitInNav = () => {
      const dropdownTrigger = document.querySelector(`.${styles.moreLink}`)
      const dropdownTriggerWidth = dropdownTrigger.getBoundingClientRect().width

      const endOfLinksSpaceInNav =
        navRightPosition - dropdownTriggerWidth - COLUMN_GAP_VALUE

      const linkElements: HTMLElement[] = Array.from(
        navRef.current.querySelectorAll(`.${styles.listItem}`),
      )

      linkElements.forEach((linkElement) => {
        linkElement.classList.remove(styles.hidden)

        const linkRightPosition = linkElement.getBoundingClientRect().right

        if (linkRightPosition > endOfLinksSpaceInNav) {
          linkElement.classList.add(styles.hidden)
        }
      })
    }
  }, [])

  return (
    <header
      className={styles.header}
      style={
        {
          "--items-padding": `${ITEMS_PADDING_VALUE}px`,
        } as React.CSSProperties
      }
    >
      <Link
        className={styles.logo}
        href={"https://www.laurarosemaryphotography.co.uk/"}
      >
        Photos by Laura Rosemary Photography
      </Link>
      <nav
        className={styles.nav}
        ref={navRef}
        style={
          {
            "--column-gap": `${COLUMN_GAP_VALUE}px`,
          } as React.CSSProperties
        }
      >
        <ul
          className={styles.ul}
          style={
            {
              "--column-gap": `${COLUMN_GAP_VALUE}px`,
            } as React.CSSProperties
          }
        >
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
          <li className={styles.moreLink}>
            <Dropdown triggerText={"MORE"} contents={[]} />
          </li>
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
      <div
        ref={dungeonRef}
        className={cx(styles.nav, styles.ul, styles.dungeon)}
      />
    </header>
  )
}
