export interface SelectionInterface {
start: number,
end: number
}

const surroundSelectionWithToken = (startToken: string, endToken: string, text: string, selection: SelectionInterface): string => {
  const { start, end } = selection
  const textToCursor = text.slice(0, start)
  const textFromCursor = text.slice(end)
  const selectedText = text.slice(start, end)

  return `${textToCursor}${startToken}${selectedText}${endToken}${textFromCursor}`
}

export default surroundSelectionWithToken
