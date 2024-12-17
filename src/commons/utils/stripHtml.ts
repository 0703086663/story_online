export const stripHtml = (text: string): string => {
  const regexForStripHTML = /<[^>]+>/g

  const striped = text.replace(regexForStripHTML, ' ')

  const plainText = striped.replace(/\s+/g, ' ').trim()

  return plainText
}
