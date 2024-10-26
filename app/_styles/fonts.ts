import { Arapey, Playfair_Display } from "next/font/google"

const arapey = Arapey({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-header",
})

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
})

const fontClassNames = [playfair, arapey]
  .map(({ variable }) => variable)
  .join(" ")

export default fontClassNames
