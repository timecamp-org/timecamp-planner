export function getAmazonIdFromUrl(fileUrl: string): string {
  return fileUrl.split('/').pop()
}

export function getResizedImageAmazonId(fileAmazonId: string, size: number) {
  const dimension = `${size}x${size}`
  return `${dimension}_b/${fileAmazonId}`
}
