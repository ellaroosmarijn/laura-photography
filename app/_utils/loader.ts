const loaders: Record<string, boolean> = {}
export const registerLoader = (name: string) => {
  loaders[name] = true
}

let resolve = null
export const loading = new Promise((resolve_) => {
  resolve = resolve_
})
export const loaderHasLoaded = (name: string) => {
  delete loaders[name]
  if (Object.keys(loaders).length === 0) {
    resolve()
  }
}
