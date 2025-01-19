"use client"

import classnames from "classnames/bind"
import { Dropdown } from "components/dropdown"
import { Tooltip } from "components/tooltip"
import { ArrowDownToLine, CornerUpRight, Heart, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import styles from "./index.module.css"

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
  const dropdownPortalTargetRef = useRef<HTMLDivElement>(null)
  const dungeonRef = useRef<HTMLDivElement>(null)
  const [dungeonDropdownElements, setDungeonDropdownElements] = useState<
    {
      text: string
      onClick: () => void
    }[]
  >([])

  useEffect(() => {
    const updateDropdownPortalPosition = () => {
      const dropdownTrigger = document.querySelector(`.${styles.moreLink}`)
      const portalTarget = document.querySelector(
        `.${styles.dropdownPortalTarget}`,
      ) as HTMLElement

      if (dropdownTrigger && portalTarget) {
        const dropdownRect = dropdownTrigger.getBoundingClientRect()
        const portalTargetWidth = portalTarget.getBoundingClientRect().width
        const header = document.querySelector(
          `.${styles.header}`,
        ) as HTMLElement
        const nav = document.querySelector(`.${styles.nav}`) as HTMLElement

        const headerHeight = header.getBoundingClientRect().height
        const navHeight = nav.getBoundingClientRect().height
        const remainingHeight = headerHeight - navHeight / 2 + 2
        const verticalPosition = remainingHeight

        portalTarget.style.top = `${verticalPosition}px`
        portalTarget.style.left = `${dropdownRect.left + dropdownRect.width / 2 - portalTargetWidth / 2}px`
      }
    }

    const checkLinksFitInNav = () => {
      const dropdownTrigger = document.querySelector(`.${styles.moreLink}`)
      const dropdownTriggerWidth = dropdownTrigger
        ? dropdownTrigger.getBoundingClientRect().width
        : 0

      const linkElements: Element[] = [
        ...navRef.current.querySelectorAll(`.${styles.listItem}`),
      ]
      const dunegonElements: Element[] = [
        ...dungeonRef.current.querySelectorAll(`.${styles.listItem}`),
      ]
      const navRect = navRef.current.getBoundingClientRect()
      const parent = navRef.current.parentElement
      const [logoEl] = parent.getElementsByClassName(styles.logo)
      const [iconsEl] = parent.getElementsByClassName(styles.icons)
      const logoRight = logoEl.getBoundingClientRect().right
      const iconsLeft = iconsEl.getBoundingClientRect().left
      const navGap = iconsLeft - logoRight

      const renderedLinksWidth = linkElements.length
        ? linkElements[linkElements.length - 1].getBoundingClientRect().right -
          navRect.left +
          COLUMN_GAP_VALUE +
          dropdownTriggerWidth
        : dropdownTriggerWidth

      let freeSpace = navGap - renderedLinksWidth

      if (freeSpace < 0) {
        while (freeSpace < 0 && linkElements.length > 0) {
          const lastLinkElement = linkElements.pop() as HTMLElement
          dungeonRef.current.prepend(lastLinkElement)

          const newRenderedLinksWidth =
            linkElements[linkElements.length - 1]?.getBoundingClientRect()
              .right -
            navRect.left +
            COLUMN_GAP_VALUE +
            dropdownTriggerWidth

          const updatedFreeSpace = navGap - newRenderedLinksWidth
          freeSpace = updatedFreeSpace

          if (updatedFreeSpace >= 0) {
            break
          }
        }
      } else if (freeSpace > 0) {
        while (freeSpace > 0 && dunegonElements.length > 0) {
          const firstDungeonElement = dunegonElements[0] as HTMLElement
          const elementWidth =
            firstDungeonElement.getBoundingClientRect().width + COLUMN_GAP_VALUE

          if (elementWidth <= freeSpace) {
            navRef.current.firstChild.insertBefore(
              firstDungeonElement,
              dropdownTrigger,
            )

            dunegonElements.shift()

            freeSpace -= elementWidth
          } else {
            break
          }
        }
      }
      const dungeonContents = dunegonElements.map((el) => {
        return {
          text: el.textContent || "Unknown Link",
          onClick: () => {
            console.log(`Clicked ${el.textContent}`)
          },
        }
      })
      setDungeonDropdownElements(dungeonContents)

      updateDropdownPortalPosition()
    }

    window.addEventListener("resize", checkLinksFitInNav)
    checkLinksFitInNav()

    return () => {
      window.removeEventListener("resize", checkLinksFitInNav)
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
      <div
        className={styles.dropdownPortalTarget}
        ref={dropdownPortalTargetRef}
      />
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
          {dungeonDropdownElements.length > 0 && (
            <li className={styles.moreLink}>
              <Dropdown
                triggerText={"MORE"}
                contents={dungeonDropdownElements}
                target={dropdownPortalTargetRef.current}
              />
            </li>
          )}
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
