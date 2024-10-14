import { ArrowDownToLine, Heart, Share, User } from "lucide-react"
import Link from "next/link"

const links = [
  { name: "Gallery", path: "#" },
  { name: "Highlights", path: "#" },
  { name: "The Preparations", path: "#" },
  { name: "The Ceremony", path: "#" },
]

export function Header() {
  return (
    <header>
      <div>Photos by Laura Rosemary Photography</div>
      <nav>
        {links.map((link, index) => (
          <Link key={index} href={link.path}>
            {link.name}
          </Link>
        ))}
      </nav>
      <div>
        <ArrowDownToLine />
        <Share />
        <Heart />
        <div />
        <User />
      </div>
    </header>
  )
}
