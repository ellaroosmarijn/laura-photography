"use client"

import { ChevronRight, Menu, X } from "lucide-react"
import styles from "./index.module.css"
import { useEffect, useState } from "react"
import { HeaderProps } from "components/header"
import Link from "next/link"
import classNames from "classnames"
import { SecondaryMobileHeader } from "./secondaryMobileHeader"

const cx = classNames.bind(styles)
const COLUMN_GAP_VALUE = 20

export function MobileHeader({ links }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [selectIsActive, setSelectIsActive] = useState(false)
  let selected = []

  useEffect(() => {
    open
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto")
  }, [open])

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        {open ? (
          <X
            className={styles.menuIcon}
            size={28}
            strokeWidth={0.75}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <Menu
            className={styles.menuIcon}
            size={28}
            strokeWidth={0.75}
            onClick={() => setOpen(!open)}
          />
        )}
        {selected.length > 0 && selectIsActive && (
          <button
            className={styles.button}
            onClick={() => console.log("Show selected photos")}
          >
            {selected.length} photos selected
            <ChevronRight strokeWidth={0.75} size={18} />
          </button>
        )}
        {selectIsActive && selected.length <= 0 && <p>Select photos</p>}
        {!selectIsActive ? (
          <p
            className={styles.select}
            onClick={() => setSelectIsActive(!selectIsActive)}
          >
            select
          </p>
        ) : (
          <X
            className={styles.menuIcon}
            size={28}
            strokeWidth={0.75}
            onClick={() => setSelectIsActive(!selectIsActive)}
          />
        )}
      </div>
      {!open ? (
        <div
          className={styles.linksSection}
          style={
            {
              "--column-gap": `${COLUMN_GAP_VALUE / 2}px`,
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
          </ul>
        </div>
      ) : (
        open && <SecondaryMobileHeader />
      )}
    </div>
  )
}
