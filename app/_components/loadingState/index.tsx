"use client"

import { loading } from "app/_utils/loader"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import styles from "./index.module.css"

export function LoadingState() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    loading.then(() => {
      setLoaded(true)
      document.body.style.overflow = "auto"
    })

    return () => {
      document.body.style.overflow = "auto"
    }
  })

  return (
    loaded === false && (
      <div className={styles.background}>
        <LoaderCircleIcon
          className={styles.loadingIcon}
          stroke="var(--color-charcoal-light)"
          size={90}
        />
      </div>
    )
  )
}
