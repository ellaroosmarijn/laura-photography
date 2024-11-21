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
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    globalPositionStateRef.current = globalPositionState
  }, [globalPositionState])

  useEffect(() => {
    const calculateLayout = () => {
      const [, setGlobalPosition] = globalPositionStateRef.current
      const rect = ref.current.getBoundingClientRect()
      const { top, left, width, height } = rect
      console.log(top, window.scrollY)
      setGlobalPosition({
        top: top + window.scrollY + height,
        left: left + window.scrollX + width / 2,
      })
    }

    const onResize = () => {
      calculateLayout()
    }

    const onScroll = () => {
      calculateLayout()
    }

    window.addEventListener("resize", onResize)
    window.document.addEventListener("scroll", onScroll)
    calculateLayout()
    return () => {
      window.removeEventListener("resize", onResize)
      window.document.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
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

      {createPortal(
        <div
          style={
            {
              "--display": open ? "block" : "none",
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
            ref={dropdownRef}
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
        </div>,
        document.body,
      )}
    </div>
  )
}
