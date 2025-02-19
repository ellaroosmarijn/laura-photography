import { LoadingState } from "components/loadingState"
import "./_styles"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          overscrollBehavior: "none",
        }}
      >
        <LoadingState />
        {children}
      </body>
    </html>
  )
}
