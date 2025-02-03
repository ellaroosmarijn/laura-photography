export type SceneImageRes = {
  src: string
  width: number
  height: number
}

export type SceneImage = {
  id: string
  alt: string
  res: { low: SceneImageRes; mid: SceneImageRes; high: SceneImageRes }
}

export type SceneImageLayout = {
  left: number
  top: number
  width: number
  aspect: number
}

export type SceneImageWithLayout = {
  image: SceneImage
  layout: SceneImageLayout
}

export type Scene = {
  name: string
  images: SceneImage[]
}
