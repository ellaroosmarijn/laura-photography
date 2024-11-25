import styles from "./index.module.css"

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
      <div>
        {scene.images.map(
          ({
            id,
            res: {
              low: { src, width, height },
            },
            alt,
          }) => (
            <div key={id}>
              <img {...{ src, alt, width, height }} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}
