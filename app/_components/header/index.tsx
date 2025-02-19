"use client"

import classnames from "classnames/bind"
import { Dropdown } from "components/dropdown"
import { Tooltip } from "components/tooltip"
import { ArrowDownToLine, CornerUpRight, Heart, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import styles from "./index.module.css"
import { registerLoader, loading, loaderHasLoaded } from "app/_utils/loader"

registerLoader("header")

const cx = classnames.bind(styles)

export type HeaderProps = {
  links?: { name: string; path: string }[]
}

const COLUMN_GAP_VALUE = 20
const ITEMS_PADDING_VALUE = 20

export function Header({ links }: HeaderProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const dropdownPortalTargetRef = useRef<HTMLDivElement>(null)
  const dungeonRef = useRef<HTMLDivElement>(null)
  const [_, setLoaded] = useState(false)

  useEffect(() => {
    loading.then(() => {
      setLoaded(true)
    })
    const updateDropdownPortalPosition = () => {
      requestAnimationFrame(() => {
        const [dropdownTrigger] = document.getElementsByClassName(
          styles.moreLink,
        )
        const [portalTarget] = [
          ...document.getElementsByClassName(styles.dropdownPortalTarget),
        ] as HTMLElement[]

        if (dropdownTrigger && portalTarget) {
          const dropdownRect = dropdownTrigger.getBoundingClientRect()
          const portalTargetWidth = portalTarget.getBoundingClientRect().width
          const [header] = [
            ...document.getElementsByClassName(styles.header),
          ] as HTMLElement[]
          const [nav] = [
            ...document.getElementsByClassName(styles.nav),
          ] as HTMLElement[]

          const headerHeight = header.getBoundingClientRect().height
          const navHeight = nav.getBoundingClientRect().height
          const remainingHeight = headerHeight - navHeight / 2 + 2
          const verticalPosition = remainingHeight

          portalTarget.style.top = `${verticalPosition}px`
          portalTarget.style.left = `${dropdownRect.left + dropdownRect.width / 2 - portalTargetWidth / 2}px`
        }
      })
    }

    const checkLinksFitInNav = () => {
      const [dropdownTrigger] = document.getElementsByClassName(styles.moreLink)
      const dropdownTriggerWidth = dropdownTrigger
        ? dropdownTrigger.getBoundingClientRect().width
        : 0

      const linkElements: Element[] = [
        ...navRef.current.getElementsByClassName(styles.listItem),
      ]
      const dungeonElements: Element[] = [
        ...dungeonRef.current.getElementsByClassName(styles.listItem),
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

      const dropdownLinks: Element[] = [
        ...document.querySelectorAll(`.moreDropdown button`),
      ]

      if (freeSpace < 0) {
        while (freeSpace < 0 && linkElements.length > 0) {
          const lastLinkElement = linkElements.pop() as HTMLElement
          dungeonRef.current.prepend(lastLinkElement)
          dropdownLinks[linkElements.length].classList.remove(styles.hidden)

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
        while (freeSpace > 0 && dungeonElements.length > 0) {
          const firstDungeonElement = dungeonElements[0] as HTMLElement
          const elementWidth =
            firstDungeonElement.getBoundingClientRect().width + COLUMN_GAP_VALUE

          if (elementWidth <= freeSpace) {
            navRef.current.firstChild.insertBefore(
              firstDungeonElement,
              dropdownTrigger,
            )
            dropdownLinks[linkElements.length].classList.add(styles.hidden)

            dungeonElements.shift()

            freeSpace -= elementWidth
          } else {
            break
          }
        }
      }

      if (dungeonElements.length <= 0) {
        const [hideMoreLink] = document.getElementsByClassName(styles.moreLink)
        hideMoreLink.classList.add(styles.hideMoreLink)
      } else if (dungeonElements.length > 0) {
        const [hideMoreLink] = document.getElementsByClassName(styles.moreLink)
        hideMoreLink.classList.remove(styles.hideMoreLink)
      }
      updateDropdownPortalPosition()
      loaderHasLoaded("header")
    }

    window.addEventListener("resize", checkLinksFitInNav)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        checkLinksFitInNav()
        // TODO: notify here that loading is done when adding global loading screen
      })
    })

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
      <nav className={styles.nav} ref={navRef}>
        <ul
          className={styles.ul}
          style={
            {
              "--column-gap": `${COLUMN_GAP_VALUE}px`,
            } as React.CSSProperties
          }
        >
          {links &&
            links.map((link, index) => (
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
            <Dropdown
              triggerText={"MORE"}
              target={dropdownPortalTargetRef}
              contents={links}
              dropdownClassName="moreDropdown"
              itemClassName={styles.hidden}
            />
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
