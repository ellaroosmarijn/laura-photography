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
  const distanceSinceLastTwoSpan = new Array(totalNumberOfColumns).fill(0)
  const minDistanceBetweenTwoSpans = 1000

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
      distanceSinceLastTwoSpan[i] = 0
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
    !columnHeights.some(
      (height, index) =>
        index < columnHeights.length - 1 && height === columnHeights[index + 1],
    )
  ) {
    images.forEach(() => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      placeAnImage(1, shortestColumnIndex)
    })
  
    return placedImagesInLayout
  }

  const matchingIndex = columnHeights.findIndex(
    (height, index) =>
      index < columnHeights.length - 1 && height === columnHeights[index + 1],
  )

  if (matchingIndex !== -1) {
    const minDistanceSinceLastTwoSpanCheck = Math.min(
      ...distanceSinceLastTwoSpan.slice(matchingIndex, matchingIndex + 2),
    )

    if (minDistanceSinceLastTwoSpanCheck >= minDistanceBetweenTwoSpans) {
      placeAnImage(2, matchingIndex)
    }
  }

  return placedImagesInLayout
}
