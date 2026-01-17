export type TextDecorator = (string) => string;

export type TextDecorators = {
  [ _: string ]: TextDecorator
}

export const HTML_DECORATORS: TextDecorators = {
  underline: (txt: string) => `<u>${txt}</u>`,
  bold: (txt: string) => `<b>${txt}</b>`,
  italic: (txt: string) => `<i>${txt}</i>`,
  mention: (txt: string) => `<span style="color: rgb(191, 138, 192);">${txt}</span>`,
}

export const MARKDOWN_DECORATORS: TextDecorators = {
  underline: (txt: string) => `__${txt.trim()}__`,
  bold: (txt: string) => `*${txt.trim()}*`,
  italic: (txt: string) => `_${txt.trim()}_`,
  strike: (txt: string) => `~${txt.trim()}~`,
  header: (txt: string) => `### ${txt.trim()}\n\n`,
  list: (txt: string) => `* ${txt.trim()}\n`,
}
