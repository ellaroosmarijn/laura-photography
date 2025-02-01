// check bottom height of each image + gap
// if any two adjacent images have the same bottom height, then place a span-2
// check for the shortest column, then place a span-1 image in it
// save in a variable bottom height of last span-2 image, only add another when it is X-px below that.
// Turn off check for bottom height is equal of two adjacent imgages if the bottom height is 0 (first row)
import { calculateSceneLayout } from "./scene-layout"

const createMockSceneImages = (
  dimensions: [width: number, height: number][],
) => {
  return dimensions.map(([width, height], id) => {
    const lowWidth = width / 2
    const lowHeight = height / 2
    const midWidth = width / 1.5
    const midHeight = height / 1.5

    return {
      id: id.toString(),
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
  })
}

describe("scene layout", () => {
  it("calculateSceneLayout", () => {
    const images = createMockSceneImages([
      [850, 333],
      [850, 333],
      [850, 333],
      [850, 333],
      [850, 333],
      [850, 333],
      [850, 333],
    ])
    const processedImages = calculateSceneLayout(images, {
      totalNumberOfColumns: 3,
    })

    expect(processedImages).toMatchObject([
      {
        leftPosition: 0,
        topPosition: 0,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 33.333333333333336,
        topPosition: 0,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 66.66666666666667,
        topPosition: 0,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 0,
        topPosition: 13.058823529411766,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 33.333333333333336,
        topPosition: 13.058823529411766,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 66.66666666666667,
        topPosition: 13.058823529411766,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
      {
        leftPosition: 0,
        topPosition: 26.117647058823533,
        imageAspectRatio: 2.5525525525525525,
        layoutImageWidth: 33.333333333333336,
      },
    ])
  })
})
