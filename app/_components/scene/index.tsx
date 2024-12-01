import styles from "./index.module.css"

type SceneImageRes = {
  src: string
  width: number
  height: number
}

export type SceneImage = {
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
  const images = [
    {
      id: "1",
      alt: "",
      res: {
        low: {
          src: "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
          width: 200,
          height: 300,
        },
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
      <div className={styles.gridContainer}>
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
