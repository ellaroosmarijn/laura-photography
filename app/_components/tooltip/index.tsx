import { ReactNode } from "react"
import styles from "./index.module.css"

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
    <div className={`${styles.tooltip} ${styles[direction]}`}>
      {children}
      <span className={styles.tooltipText}>{text}</span>
    </div>
  )
}
