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
    },
    {
      id: "2",
      alt: "",
      res: {
        low: {
          src: "https://fastly.picsum.photos/id/866/700/300.jpg?hmac=XtL-UtEs4UPCBkzOZm9H4Nl7DAflaMpUaAkmIwKU8hU",
          width: 700,
          height: 300,
        },
      },
    },
    {
      id: "3",
      alt: "",
      res: {
        low: {
          src: "https://fastly.picsum.photos/id/866/300/300.jpg?hmac=9qmLpcaT9TgKd6PD37aZJZ_7QvgrVFMcvI3JQKWVUIQ",
          width: 300,
          height: 300,
        },
      },
    },
    {
      id: "4",
      alt: "",
      res: {
        low: {
          src: "https://fastly.picsum.photos/id/866/400/200.jpg?hmac=RWo6-RXf6jQ7JOknMozr8Z8svD1i0F9m1XGfTlNyVKM",
          width: 400,
          height: 200,
        },
      },
    },
    {
      id: "5",
      alt: "",
      res: {
        low: {
          src: "https://fastly.picsum.photos/id/866/800/300.jpg?hmac=sWj6Xpp9M0IkuJ7oC8WxihWonXSQ8vXPLO4jG8X7FBw",
          width: 800,
          height: 300,
        },
      },
    },
  ]

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
                {/*// TODO: use Image from next */}
                <img {...{ src, alt, width, height }} />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
