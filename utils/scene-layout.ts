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
  const minDistanceForTwoSpan = 1000

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
      if (
        Math.min(
          ...distanceSinceLastTwoSpan.slice(matchingIndex, matchingIndex + 2),
        ) >= minDistanceForTwoSpan
      ) {
        placeAnImage(2, matchingIndex)

        const imageAspectRatio =
          images[0].res.high.width / images[0].res.high.height
        const columnWidth = layoutWidth / totalNumberOfColumns
        const layoutImageWidth = columnWidth * 2
        const layoutImageHeight = layoutImageWidth / imageAspectRatio

        columnHeights[matchingIndex] += layoutImageHeight
        columnHeights[matchingIndex + 1] += layoutImageHeight

        distanceSinceLastTwoSpan[matchingIndex] = 0
        distanceSinceLastTwoSpan[matchingIndex + 1] = 0
      }
    } else {
      // column 0, 1, 2
      // span >= 1
      for (let i = 0; i < images.length; i++) {
        const shortestColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights),
        )
        const imageAspectRatio =
          images[i].res.high.width / images[i].res.high.height
        const columnWidth = layoutWidth / totalNumberOfColumns
        const layoutImageWidth = columnWidth * 1
        const layoutImageHeight = layoutImageWidth / imageAspectRatio

        placeAnImage(1, shortestColumnIndex)

        distanceSinceLastTwoSpan[shortestColumnIndex] += layoutImageHeight
      }
    }
  }

  return placedImagesInLayout
}
