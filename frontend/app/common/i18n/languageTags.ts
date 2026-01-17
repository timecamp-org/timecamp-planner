export const tags = {
  pl: 'polski',
  en: 'English',
  hu: 'Magyar',
  fr: 'Français'
}

export function getLanguageTag(code: string): string {
  return tags[code]
}
