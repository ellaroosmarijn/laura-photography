import classNames from "classnames"
import Link from "next/link"
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
            <li className={styles.listItem} key={index}>
              <Link href={link.path} className={cx(styles.link)}>
                {link.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
