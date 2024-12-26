"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import styles from "./index.module.css"

type DropdownProps = {
  triggerText: string
  contents: { text: string; onClick: () => void }[]
}

export function Dropdown({ triggerText, contents }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    <div className={styles.wrapper} {...{ ref }}>
      <div className={styles.trigger} onClick={() => setOpen((open) => !open)}>
        <div className={styles.triggerText}>{triggerText}</div>
        {open === true ? (
          <ChevronUp className={styles.chevron} strokeWidth={1} />
        ) : (
          <ChevronDown className={styles.chevron} strokeWidth={1} />
        )}
      </div>
      <div className={styles.dropdownArrow} style={
          { "--display": open ? "block" : "none",
          } as React.CSSProperties}/>
      <div
        style={
          {
            "--display": open ? "block" : "none",
            width: "0px",
            height: "0px",
            position: "absolute",
            zIndex: "1000",
            left: "50%",
          } as React.CSSProperties
        }
      >
        <div
          className={styles.dropdown}
          style={{
            transform: "translate(-50%, 0)",
          }}
        >
          {contents.map((content, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                content.onClick()
                setOpen((open) => !open)
              }}
            >
              {content.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
