import { ReactNode } from "react"

type TooltipProps = {
  children: ReactNode
  text: string
  direction: "top" | "bottom" | "left" | "right"
}

export function Tooltip({
  children,
  text,
  direction = "bottom",
}: TooltipProps) {
  return (
    <div>
      {children}
      <span>{text}</span>
    </div>
  )
}
