"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import styles from "./index.module.css"

type DropdownProps = {
  triggerText: string
  contents: { text: string; onClick: () => void }[]
}

export function Dropdown({ triggerText, contents }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={styles.trigger} onClick={() => setOpen((open) => !open)}>
        <div>{triggerText}</div>
        {open === true ? <ChevronDown /> : <ChevronUp />}
      </div>
      {open === true && (
        <div>
          {contents.map((content, index) => (
            <button key={index} onClick={content.onClick}>
              {content.text}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
