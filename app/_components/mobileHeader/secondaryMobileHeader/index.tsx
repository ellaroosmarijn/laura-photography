import classNames from "classnames"
import { Link } from "lucide-react"
import styles from "./index.module.css"

const cx = classNames.bind(styles)

type SecondaryMobileHeaderProps = {
  settingLinks?: { name: string; path: string }[]
}
export function SecondaryMobileHeader({
  settingLinks,
}: SecondaryMobileHeaderProps) {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.ul}>
        {settingLinks &&
          settingLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
