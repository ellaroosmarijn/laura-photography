import { GalleryHero } from "components/gallery-hero"
import { Header } from "components/header"

export default function Page() {
  return (
    <>
      <GalleryHero
        alt="hero image test"
        src={"/LR.jpg"}
        title="Ellen & Dave - Davenport House"
        subtitle="May 18, 2024"
      />
      <Header />
      <div style={{ width: "100%", height: "1000px" }}>
        <div style={{ width: "100%", height: "30px", background: "tomato" }} />
      </div>
    </>
  )
}
