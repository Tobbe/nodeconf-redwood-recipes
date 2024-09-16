export function isUploadedImage(url?: string) {
  return (
    url &&
    !(url.startsWith('http://') || url.startsWith('https://')) &&
    /\.(jpeg|jpg|gif|png)$/i.test(url)
  )
}

export function makeUrlSigned(url: string) {
  return `/signedUrl?url=${url}`
}

export function makeUrl(path: string) {
  return `${global.RWJS_API_URL}/${path.replace(
    'uploads/recipe-images',
    'recipe-photos'
  )}`
}
