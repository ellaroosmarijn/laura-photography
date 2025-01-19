import { GalleryHero } from "components/gallery-hero"
import { Header } from "components/header"
import { Scene } from "components/scene"

export default function Page() {
  const links = [
    { name: "Gallery", path: "#" },
    { name: "Highlights", path: "#highlights" },
    { name: "The Preparations", path: "#" },
    { name: "The Ceremony", path: "#" },
    { name: "I'm a tester", path: "#" },
    { name: "HElloooo", path: "#" },
    { name: "blahhhhhhhh", path: "#" },
    { name: "djbkliuhIUBHDUIUH", path: "#" },
  ]

  return (
    <>
      <GalleryHero
        alt="hero image test"
        src={"/LR.jpg"}
        title="Ellen & Dave - Davenport House"
        subtitle="May 18, 2024"
      />
      <Header links={links} />
      <div style={{ width: "100%", height: "1000px" }}>
        <Scene />
      </div>
      <p id="highlights">Testing HIGHLIGHTS</p>
    </>
  )
}
