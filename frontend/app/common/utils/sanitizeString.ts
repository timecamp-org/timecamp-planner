import sanitize from 'sanitize-filename'

export default function sanitizeString(input: string): string {
  let output: string = sanitize(input)
  output = encodeURIComponent(output)
  return output
}
