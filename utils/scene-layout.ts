import { SceneImage } from "components/scene"

const layoutWidth = 100

type SceneLayoutCalculationOptions = { totalNumberOfColumns: number }

export function calculateSceneLayout(
  images_: SceneImage[],
  { totalNumberOfColumns }: SceneLayoutCalculationOptions,
) {
  const columnHeights = new Array(totalNumberOfColumns).fill(0)
  const placedImagesInLayout = []
  const images = [...images_]

  console.log(">>>>>>>", columnHeights)

  const placeAnImage = (spanColumns: number, atLeftMostColumnIndex: number) => {
    if (images.length === 0) {
      return false
    }

    const image = images.shift()

    const columnWidth = layoutWidth / totalNumberOfColumns
    const leftPosition = columnWidth * atLeftMostColumnIndex
    const layoutImageWidth = columnWidth * spanColumns
    const topPosition = columnHeights[atLeftMostColumnIndex]
    const imageAspectRatio = image.res.high.width / image.res.high.height
    const layoutImageHeight = layoutImageWidth / imageAspectRatio

    columnHeights[atLeftMostColumnIndex]

    for (
      let i = atLeftMostColumnIndex;
      i < atLeftMostColumnIndex + spanColumns;
      i++
    ) {
      columnHeights[i] += layoutImageHeight
    }

    placedImagesInLayout.push({
      image,
      leftPosition,
      topPosition,
      imageAspectRatio,
      layoutImageWidth,
    })

    return images.length > 0
  }

  if (
    columnHeights.some(
      (height, index) =>
        index < columnHeights.length - 1 && height === columnHeights[index + 1],
    )
  ) {
    const matchingIndex = columnHeights.findIndex(
      (height, index) =>
        index < columnHeights.length - 1 && height === columnHeights[index + 1],
    )

    if (matchingIndex !== -1) {
      placeAnImage(2, matchingIndex)

      const imageAspectRatio =
        images[0].res.high.width / images[0].res.high.height
      const columnWidth = layoutWidth / totalNumberOfColumns
      const layoutImageWidth = columnWidth * 2
      const layoutImageHeight = layoutImageWidth / imageAspectRatio

      columnHeights[matchingIndex] += layoutImageHeight
      columnHeights[matchingIndex + 1] += layoutImageHeight
    }
  } else {
    for (let i = 0; i < images.length; i++) {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      )
      placeAnImage(1, shortestColumnIndex)
    }
  }

  return placedImagesInLayout
}
