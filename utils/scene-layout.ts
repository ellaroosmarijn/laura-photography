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

  if (false) {
    // if two columns are the same height
  } else {
    // column 0, 1, 2
    // span >= 1
    // which column it goes into?
    while (placeAnImage(1, 1)) {}
  }

  return placedImagesInLayout
}
