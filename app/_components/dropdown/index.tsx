"use client"

import { useState } from "react"

type DropdownProps = {
  triggerText: string
  contents: { text: string; onClick: () => void }[]
}

export function Dropdown({ triggerText, contents }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{triggerText}</div>
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
