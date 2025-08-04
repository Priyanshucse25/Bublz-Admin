// utils/buildUrl.js
export function buildUrl(image_url) {
  if (!image_url) return ''
  // If it's already a full URL or a data URI, return as-is
  if (image_url.startsWith('http') || image_url.startsWith('data:')) {
    return image_url
  }
  const imgPrefix = 'https://res.cloudinary.com/dx92am71k/image/upload/'
  return `${imgPrefix}${image_url}`
}
