import { SceneImage } from "components/scene"

const layoutWidth = 100

type SceneLayoutCalculationOptions = { totalNumberOfColumns: number }

const MIN_DISTANCE_BETWEEN_TWO_SPANS = 10
const MAX_DISTANCE_DIFFERENCE_BETWEEN_COLUMNS = 100

export function calculateSceneLayout(
  images_: SceneImage[],
  { totalNumberOfColumns }: SceneLayoutCalculationOptions,
) {
  const columnHeights = new Array(totalNumberOfColumns).fill(0)
  const unprocessedImages = [...images_]
  const processedImages = []
  let lastTwoSpanBottomPosition = MIN_DISTANCE_BETWEEN_TWO_SPANS * 2

  const placeAnImage = (spanColumns: number, leftColIndex: number) => {
    if (unprocessedImages.length === 0) {
      return false
    }

    const image = unprocessedImages.shift()

    const columnWidth = layoutWidth / totalNumberOfColumns
    const leftPosition = columnWidth * leftColIndex
    const layoutImageWidth = columnWidth * spanColumns
    const topPosition = columnHeights[leftColIndex]
    const imageAspectRatio = image.res.high.width / image.res.high.height
    const layoutImageHeight = layoutImageWidth / imageAspectRatio

    for (let i = leftColIndex; i < leftColIndex + spanColumns; i++) {
      columnHeights[i] += layoutImageHeight
    }

    processedImages.push({
      image,
      leftPosition,
      topPosition,
      imageAspectRatio,
      layoutImageWidth,
    })
  }

  let i = 0
  while (i < 10 && unprocessedImages.length > 0) {
    let placementIndex = -1
    let spanColumns = 1
    let adjacentTopPosition = 0
    const adjacentPlacementIndex = columnHeights.findIndex((height, i) => {
      const nextHeight = columnHeights[i + 1]
      if (nextHeight == null) {
        return false
      }
      const isNearEnough = Math.abs(nextHeight - height) < 0.2
      if (isNearEnough) {
        adjacentTopPosition = height
        return true
      }
    })
    const canTwoSpan =
      adjacentPlacementIndex != null && adjacentTopPosition !== 0
    if (canTwoSpan) {
      const twoSpanGap = lastTwoSpanBottomPosition - adjacentTopPosition
      const isTwoSpanGapBigEnough = twoSpanGap >= MIN_DISTANCE_BETWEEN_TWO_SPANS
      const isTwoSpanNotLongestColumn =
        adjacentTopPosition !== Math.max(...columnHeights) ||
        Math.max(...columnHeights) - Math.min(...columnHeights) <=
          MAX_DISTANCE_DIFFERENCE_BETWEEN_COLUMNS
      const canPlaceTwoSpan = isTwoSpanGapBigEnough && isTwoSpanNotLongestColumn

      if (canPlaceTwoSpan) {
        placementIndex = adjacentPlacementIndex
        spanColumns = 2
      }
    }
    if (placementIndex === -1) {
      placementIndex = columnHeights.indexOf(Math.min(...columnHeights))
    }
    placeAnImage(spanColumns, placementIndex)
    if (canTwoSpan) {
      const twoSpan = processedImages[processedImages.length - 1]
      lastTwoSpanBottomPosition =
        twoSpan.topPosition +
        twoSpan.layoutImageWidth * twoSpan.imageAspectRatio
    }
  }
  return processedImages
}
