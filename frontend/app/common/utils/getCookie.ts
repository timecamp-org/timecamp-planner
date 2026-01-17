import { Maybe } from "../types";


export default function (name: string): Maybe<string> {
  if (typeof document === 'undefined') {
    return null
  }
  try {
    var re = new RegExp(`${name}=([^;]+)`)
    var value = re.exec(document.cookie)
    return (value != null) ? unescape(value[1]) : null
  } catch (error) {
    // ok
    return null
  }
}
