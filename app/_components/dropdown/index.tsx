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

  useEffect(() => {
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

      {open &&
        target.current &&
        createPortal(
          <div className={styles.dropdownPositioner}>
            <div
              className={styles.dropdownArrow}
              style={{
                display: open ? "block" : "none",
              }}
            />
            <div
              className={styles.dropdown}
              ref={dropdownRef}
              style={{
                display: open ? "block" : "none",
              }}
            >
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
