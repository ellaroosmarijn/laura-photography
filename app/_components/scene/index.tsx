import Image from "next/image"

type SceneImage = {
  id: string
  src: string
  alt: string
  res: { low: string; mid: string; high: string }
}

type Scene = {
  name: string
  images: SceneImage[]
}

type SceneProps = {
  scene: Scene
}

export function Scene({ scene }: SceneProps) {
  return (
    <>
      <h2>{scene.name}</h2>
      {scene.images.map(({ id, src, alt }) => (
        <Image key={id} src={src} alt={alt} />
      ))}
    </>
  )
}
