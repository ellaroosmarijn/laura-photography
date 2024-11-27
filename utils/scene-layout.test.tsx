// check bottom height of each image + gap
// if any two adjacent imges have the same bottom height, then place a span-2
// check for the shortest column, then place a span-1 image in it
// save in a variable bottom height of last span-2 image, only add another when it is X-px below that.
// Turn off check for bottom height is equal of two adjacent imgages if teh bottom height is 0 (first row)
import { calculateSceneLayout } from "./scene-layout"

const createMockSceneImage = (id: string, width: number, height: number) => {
  const lowWidth = width / 2
  const lowHeight = height / 2
  const midWidth = width / 1.5
  const midHeight = height / 1.5

  return {
    id: id,
    alt: "",
    res: {
      low: {
        src: `https://picsum.photos/id/866/${lowWidth}/${lowHeight}.jpg`,
        width: lowWidth,
        height: lowHeight,
      },
      mid: {
        src: `https://picsum.photos/id/866/${midWidth}/${midHeight}.jpg`,
        width: midWidth,
        height: midHeight,
      },
      high: {
        src: `https://picsum.photos/id/866/${width}/${height}.jpg`,
        width,
        height,
      },
    },
  }
}

const imageDimensions = [
  [850, 333],
  [850, 333],
  [850, 333],
  [850, 333],
  [850, 333],
  [850, 333],
  [850, 333],
]

const images = imageDimensions.map((dimensions, i) =>
  createMockSceneImage(i.toString(), dimensions[0], dimensions[1]),
)

describe("scene layout", () => {
  it("calculateSceneLayout", () => {
    const returnedValue = calculateSceneLayout(images, {
      totalNumberOfColumns: 3,
    })

    console.log(returnedValue)
  })
})
