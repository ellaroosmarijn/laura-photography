"use client"

import { loading } from "app/_utils/loader"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import styles from "./index.module.css"

const LOADING_ICON_SIZE = 90
const ICON_POSITIONING = LOADING_ICON_SIZE / 2

export function LoadingState() {
  const [loaded, setLoaded] = useState(false)
  const [loaderVisible, setLoaderVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaderVisible(true), 500)
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
    loaded === true && (
      <div className={styles.background}>
        {loaderVisible && (
          <LoaderCircleIcon
            className={styles.loadingIcon}
            stroke="var(--color-charcoal-light)"
            size={LOADING_ICON_SIZE}
            style={
              {
                "--icons-positioning": `${ICON_POSITIONING}px`,
              } as React.CSSProperties
            }
          />
        )}
      </div>
    )
  )
}
