"use client"

import styles from "./index.module.css"
import { useEffect, useRef } from "react"

type SceneImageRes = {
  src: string
  width: number
  height: number
}

type SceneImage = {
  id: string
  alt: string
  res: { low: SceneImageRes; mid: SceneImageRes; high: SceneImageRes }
}

type Scene = {
  name: string
  images: SceneImage[]
}

type SceneProps = {
  scene: Scene
}

export function Scene({}: SceneProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gridItems = gridRef.current?.querySelectorAll(".gridItem")

    gridItems?.forEach((item) => {
      const element = item as HTMLElement
      const content = element.querySelector("img")
      if (content) {
        const rowHeight = content.naturalHeight / content.naturalWidth
        const span = Math.ceil(rowHeight * 3)
        element.style.setProperty("--row-span", span.toString())
      }
    })
  }, [])

  const images = Array.from({ length: 30 }, (_, i) => ({
    id: i.toString(),
    alt: "",
    res: {
      low: {
        src: "https://picsum.photos/id/29/500/333",
        width: 500,
        height: 333,
      },
      mid: {
        src: "https://picsum.photos/id/29/500/333",
        width: 500,
        height: 333,
      },
      high: {
        src: "https://picsum.photos/id/29/500/333",
        width: 500,
        height: 333,
      },
    },
  }))

  const scene = {
    name: "Test Scene",
    images,
  }

  return (
    <div className={styles.sceneWrapper}>
      <h2>{scene.name}</h2>
      <div className={styles.gridContainer} ref={gridRef}>
        {scene.images.map(
          ({
            id,
            res: {
              low: { src, width, height },
            },
            alt,
          }) => (
            <div key={id} className={styles.gridItem}>
              <div>
                <img {...{ src, alt, width, height }} />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
