"use client"

import { useState } from "react"

type DropdownProps = {
  triggerText: string
  contents: string[]
}

export function Dropdown({ triggerText, contents }: DropdownProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div onClick={() => setOpen(true)}>{triggerText}</div>
      {contents &&
        open === true &&
        contents.map((content, index) => <div key={index}>{content}</div>)}
    </>
  )
}
