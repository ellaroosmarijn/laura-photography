"use client"

import { ChevronRight, Menu, X } from "lucide-react"
import styles from "./index.module.css"
import { useState } from "react"
import { HeaderProps } from "components/header"
import Link from "next/link"
import classNames from "classnames"

const cx = classNames.bind(styles)

export function MobileHeader({ links }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [selectIsActive, setSelectIsActive] = useState(false)
  let selected = []

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
      <div className={styles.linksSection}>
        <ul>
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
    </div>
  )
}
