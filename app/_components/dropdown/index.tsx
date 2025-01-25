"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { RefObject, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./index.module.css"

type DropdownProps = {
  triggerText: string
  contents: { name: string; path: string }[]
  target: RefObject<HTMLElement | null>
}

export function Dropdown({ triggerText, contents, target }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.trigger} onClick={() => setOpen((open) => !open)}>
        <button className={styles.triggerText}>{triggerText}</button>
        {open === true ? (
          <ChevronUp className={styles.chevron} strokeWidth={1} />
        ) : (
          <ChevronDown className={styles.chevron} strokeWidth={1} />
        )}
      </div>

      {ready &&
        createPortal(
          <div
            className={cx(styles.dropdownPositioner, dropdownClassName, {
              [styles.show]: open,
            })}
          >
            <div className={styles.dropdownArrow} />
            <div className={styles.dropdown} ref={dropdownRef}>
              {contents.map((content, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(false)
                    window.location.hash = content.path
                  }}
                >
                  {content.name}
                </button>
              ))}
            </div>
          </div>,
          target.current,
        )}
    </div>
  )
}
