import { M_PLUS_1 } from "next/font/google"
import { SceneImage, SceneImageWithLayout } from "shared/scene"

const LAYOUT_WIDTH = 100

type SceneLayoutCalculationOptions = { totalNumberOfColumns: number }

const MIN_DISTANCE_BETWEEN_TWO_SPANS = 10
const MAX_DISTANCE_DIFFERENCE_BETWEEN_COLUMNS = 100

export function calculateSceneLayout(
  images_: SceneImage[],
  { totalNumberOfColumns }: SceneLayoutCalculationOptions,
) {
  const columnHeights = new Array(totalNumberOfColumns).fill(0)
  const unprocessedImages: SceneImage[] = [...images_]
  const processedImages: SceneImageWithLayout[] = []
  let lastTwoSpanBottomPosition = MIN_DISTANCE_BETWEEN_TWO_SPANS * 2

  const placeAnImage = (spanColumns: number, leftColIndex: number) => {
    if (unprocessedImages.length === 0) {
      return false
    }

    const image = unprocessedImages.shift()

    const columnWidth = LAYOUT_WIDTH / totalNumberOfColumns
    const left = columnWidth * leftColIndex
    const width = columnWidth * spanColumns
    const top = columnHeights[leftColIndex]
    const aspect = image.res.high.width / image.res.high.height
    const height = width / aspect

    for (let i = leftColIndex; i < leftColIndex + spanColumns; i++) {
      columnHeights[i] += height
    }

    processedImages.push({
      image,
      layout: {
        left,
        top,
        width,
        aspect,
      },
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
      lastTwoSpanBottomPosition = twoSpan.layout.top
      twoSpan.layout.width * twoSpan.layout.aspect
    }
  }
  return processedImages
}
