"use client"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { calculateSceneLayout } from "utils/scene-layout"
import { SceneImage, SceneImageWithLayout, type Scene } from "shared/scene"
import styles from "./index.module.css"

type SceneProps = {
  scene: Scene
}

export function Scene({}: SceneProps) {
  const [layout, setLayout] = useState<SceneImageWithLayout[]>(null)
  const [layoutAspectRatio, setLayoutAspectRatio] = useState<number>()

  useMemo(() => {
    const { images: layoutData, layoutAspectRatio } = calculateSceneLayout(
      SCENE.images,
      {
        totalNumberOfColumns: 3,
      },
    )
    setLayout(layoutData)
    setLayoutAspectRatio(layoutAspectRatio)
  }, [SCENE.images])

  // TODO: replace this with the global loading state
  if (!layout) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.sceneWrapper}>
      <h2>{SCENE.name}</h2>
      <div
        className={styles.images}
        style={
          {
            "--aspect": `${layoutAspectRatio}`,
          } as CSSProperties
        }
      >
        {layout.map((sceneImage) => (
          <img
            key={sceneImage.image.id}
            style={
              {
                "--width": `${sceneImage.layout.width}%`,
                "--aspect": `${sceneImage.layout.aspect}`,
                "--top": `${sceneImage.layout.top}%`,
                "--left": `${sceneImage.layout.left}%`,
              } as React.CSSProperties
            }
            src={sceneImage.image.res.mid.src}
            alt={sceneImage.image.alt}
          />
        ))}
      </div>
    </div>
  )
}

// https://picsum.photos/500/889
const IMAGES: SceneImage[] = [
  {
    id: "1",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/1048/320/570.jpg?hmac=zr9uuRT04HJ0FQsGTlQjF_cvkkjAaoM3sC9FX8kvdiI",
        width: 320,
        height: 570,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/594/640/1140.jpg?hmac=VoGaqHgn-9DiEKJsN7BKSwntuAB3NCbNRCymsgQyLkM",
        width: 640,
        height: 1140,
      },
      high: {
        src: "https://fastly.picsum.photos/id/187/1280/2280.jpg?hmac=SSB_9ub5P0CdPcRqWTqj-f3OtLY9JTAeLn0oQwVuoGU",
        width: 1280,
        height: 2280,
      },
    },
  },
  {
    id: "2",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/1062/500/889.jpg?hmac=CV_mbKGq0_zobbYT0Bq8CBsA4hYfSGWfeI03eYpt-eg",
        width: 500,
        height: 889,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/206/1000/1778.jpg?hmac=cpw4ZVxKKqegBYikSUh3Dn4GQD1fb3EINWJq9hVJDFU",
        width: 1000,
        height: 1778,
      },
      high: {
        src: "https://fastly.picsum.photos/id/591/2000/3556.jpg?hmac=w4e0EmJzGiddlxdV_oIP9kZkRnkOR3hpcNn1EzR0Wr0",
        width: 2000,
        height: 3556,
      },
    },
  },
  {
    id: "3",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/783/400/533.jpg?hmac=dxnK1kCMjlGl2VR-X_ydmyhB1GM8mqyW6weBYVhxbhM",
        width: 400,
        height: 533,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/291/800/1066.jpg?hmac=9TDyvi77ORBiw8djOyzNVV__gQZGtA0cXPeedA7X61g",
        width: 800,
        height: 1066,
      },
      high: {
        src: "https://fastly.picsum.photos/id/208/1600/2132.jpg?hmac=1DfEfE4ep4dJtkzNELISc_xBbFl2wbMqz4p0Euwhrlc",
        width: 1600,
        height: 2132,
      },
    },
  },
  {
    id: "4",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/380/300/400.jpg?hmac=VK6ZBMZ9_78Kr9hdpgpOEKWRZBh-AGYoRePi81rAmMs",
        width: 300,
        height: 400,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/593/600/800.jpg?hmac=L7ZpzM5fOCWGNV-yN1OkiKQCXtBPAY-fP7BNit5ban8",
        width: 600,
        height: 800,
      },
      high: {
        src: "https://fastly.picsum.photos/id/315/1200/1600.jpg?hmac=YnoS9sn0i4sVbdhGNDrnKmMkaTzhGMFFojZ7gtm75hA",
        width: 1200,
        height: 1600,
      },
    },
  },
  {
    id: "5",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/418/450/800.jpg?hmac=hr9NsDJuwY0I5kO6RBCZllsytgcSk_09jOi0DgtPkAY",
        width: 450,
        height: 800,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/781/900/1600.jpg?hmac=gKvRVJ2bbZ_lOirge8hB6KWrTfEXsKZYqq7BIsTNYDY",
        width: 900,
        height: 1600,
      },
      high: {
        src: "https://fastly.picsum.photos/id/716/1800/3200.jpg?hmac=LuMTzrtvNT9KBFUPAHKIlj75X2aZul3vuGTWhXCDe18",
        width: 1800,
        height: 3200,
      },
    },
  },
  {
    id: "6",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/122/375/500.jpg?hmac=ZTg9rTArtIrcw5NCUEDmcWJHC60gUyJUT7JeB3eDXnw",
        width: 375,
        height: 500,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/861/750/1000.jpg?hmac=UKvxCFOQRj_4Lo1QZjfGiAOqvS5q5aCa20tCcyaEmRE",
        width: 750,
        height: 1000,
      },
      high: {
        src: "https://fastly.picsum.photos/id/91/1500/2000.jpg?hmac=NpW5tjP9KKxtrkLuvZdccDtw1LLJthUYVDc4tBUOTOU",
        width: 1500,
        height: 2000,
      },
    },
  },
  {
    id: "7",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/1048/320/570.jpg?hmac=zr9uuRT04HJ0FQsGTlQjF_cvkkjAaoM3sC9FX8kvdiI",
        width: 320,
        height: 570,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/594/640/1140.jpg?hmac=VoGaqHgn-9DiEKJsN7BKSwntuAB3NCbNRCymsgQyLkM",
        width: 640,
        height: 1140,
      },
      high: {
        src: "https://fastly.picsum.photos/id/187/1280/2280.jpg?hmac=SSB_9ub5P0CdPcRqWTqj-f3OtLY9JTAeLn0oQwVuoGU",
        width: 1280,
        height: 2280,
      },
    },
  },
  {
    id: "8",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/783/400/533.jpg?hmac=dxnK1kCMjlGl2VR-X_ydmyhB1GM8mqyW6weBYVhxbhM",
        width: 400,
        height: 533,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/291/800/1066.jpg?hmac=9TDyvi77ORBiw8djOyzNVV__gQZGtA0cXPeedA7X61g",
        width: 800,
        height: 1066,
      },
      high: {
        src: "https://fastly.picsum.photos/id/208/1600/2132.jpg?hmac=1DfEfE4ep4dJtkzNELISc_xBbFl2wbMqz4p0Euwhrlc",
        width: 1600,
        height: 2132,
      },
    },
  },
  {
    id: "9",
    alt: "",
    res: {
      low: {
        src: "https://fastly.picsum.photos/id/1062/500/889.jpg?hmac=CV_mbKGq0_zobbYT0Bq8CBsA4hYfSGWfeI03eYpt-eg",
        width: 500,
        height: 889,
      },
      mid: {
        src: "https://fastly.picsum.photos/id/206/1000/1778.jpg?hmac=cpw4ZVxKKqegBYikSUh3Dn4GQD1fb3EINWJq9hVJDFU",
        width: 1000,
        height: 1778,
      },
      high: {
        src: "https://fastly.picsum.photos/id/591/2000/3556.jpg?hmac=w4e0EmJzGiddlxdV_oIP9kZkRnkOR3hpcNn1EzR0Wr0",
        width: 2000,
        height: 3556,
      },
    },
  },
]

const SCENE = {
  name: "Test Scene",
  images: IMAGES,
}
