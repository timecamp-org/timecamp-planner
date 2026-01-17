import { getInitials } from "../utils/getInitials"


export default function (name: string): string {
  if (!name) {
    return ''
  }
  const [firstName, lastName, email] = name.split(' ')
  return getInitials(firstName, lastName, email)
}
