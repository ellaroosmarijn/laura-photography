"use client"

import { ChevronRight, Menu, X } from "lucide-react"
import styles from "./index.module.css"
import { useState } from "react"

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const [selectIsActive, setSelectIsActive] = useState(false)
  let selected = [1, 0]

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        {open ? (
          <X
            className={styles.hamburger}
            size={28}
            strokeWidth={0.75}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <Menu
            className={styles.hamburger}
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
        {selectIsActive && <p>Select photos</p>}
        {!selectIsActive ? (
          <p
            className={styles.select}
            onClick={() => setSelectIsActive(!selectIsActive)}
          >
            select
          </p>
        ) : (
          <X
            className={styles.hamburger}
            size={28}
            strokeWidth={0.75}
            onClick={() => setSelectIsActive(!selectIsActive)}
          />
        )}
      </div>
      <div className={styles.linksSection}></div>
    </div>
  )
}
