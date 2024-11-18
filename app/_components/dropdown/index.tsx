"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./index.module.css"

type DropdownProps = {
  triggerText: string
  contents: { text: string; onClick: () => void }[]
}

export function Dropdown({ triggerText, contents }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const globalPositionState = useState({ top: 0, left: 0 })
  const globalPositionStateRef = useRef(globalPositionState)

  useEffect(() => {
    globalPositionStateRef.current = globalPositionState
  }, [globalPositionState])

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onResize = () => {
      const [globalPosition, setGlobalPosition] = globalPositionStateRef.current
      const rect = ref.current.getBoundingClientRect()
      console.log(rect)
      const { top, left, width, height } = rect

      setGlobalPosition({
        top: top + window.scrollY + height,
        left: left + window.scrollX + width / 2,
      })
    }

    window.addEventListener("resize", onResize)
    onResize()
    return () => {
      window.removeEventListener("resize", onResize)
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

      {createPortal(
        <div
          style={
            {
              "--display": open ? "flex" : "none",
              width: "0px",
              height: "0px",
              position: "absolute",
              zIndex: "1000",
              top: `${globalPositionState[0].top}px`,
              left: `${globalPositionState[0].left}px`,
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
              <button key={index} onClick={content.onClick}>
                {content.text}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
