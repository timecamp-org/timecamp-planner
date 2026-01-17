export function prepareDateToParse(date: string, format: string): string {
  if (!date) {
    return ''
  }
  let result = date
  const regex = getRegex(format)
  const dateArray = date.match(regex)
  if (dateArray) {
    switch (format) {
      default:
      case 'DD.MM.YYYY': {
        result = `${dateArray[2]}.${dateArray[1]}.${dateArray[3]}`
        break
      }
      case 'MM.DD.YYYY': {
        result = `${dateArray[1]}.${dateArray[2]}.${dateArray[3]}`
        break
      }
      case 'YYYY.MM.DD': {
        result = `${dateArray[2]}.${dateArray[3]}.${dateArray[1]}`
        break
      }
    }
  }

  return result
}

function getRegex(format: string): string {
  switch (format) {
    default:
    case 'DD.MM.YYYY':
    case 'MM.DD.YYYY': return '([0-9]{1,2})[^:]([0-9]{1,2})[^:]([0-9]{2,4})'
    case 'YYYY.MM.DD': return '([0-9]{2,4})[^:]([0-9]{1,2})[^:]([0-9]{1,2})'
  }
}
