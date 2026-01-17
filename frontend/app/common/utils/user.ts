export function getInitials(firstName: string, lastName: string, email: string): string {
  let initials = ''
  if (firstName) {
    initials = lastName ? `${firstName.slice(0, 1)}${lastName.slice(0, 1)}` : `${firstName.slice(0, 2)}`
  } else {
    initials = email.slice(0, 2)
  }
  return initials.toUpperCase()
}

export function getUserName(firstName: string, lastName: string, email: string, displayLastNameFirst: boolean): string {
  let result = email

  if (typeof firstName === 'string' && typeof lastName === 'string') {
    if (firstName.length > 0 && lastName.length > 0) {
      if (displayLastNameFirst) {
        result = `${lastName} ${firstName}`
      } else {
        result = `${firstName} ${lastName}`
      }
    } else if (firstName.length > 0 && lastName.length === 0) {
      result = firstName
    }
  }

  return result
}
