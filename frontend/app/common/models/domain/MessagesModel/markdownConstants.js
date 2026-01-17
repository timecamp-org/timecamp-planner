// keys need to be lowercase
export const emoticons = {
  ':d': ':smile:',
  ':)': ':slightly_smiling_face:',
  ';)': ':wink:',
  ':(': ':disappointed:',
  ';(': ':cry:',
  ':>': ':laughing:',
  '8)': ':sunglasses:',
  ':|': ':neutral_face:',
  ':o': ':open_mouth:',
  ';p': ':stuck_out_tongue_winking_eye:',
  ':p': ':stuck_out_tongue:',
  '<3': ':heart:',
  '</3': ':broken_heart:',
  ':*': ':kissing_heart:',
  ':/': ':confused:',
}

export const react = 'react'

export const markdownEntityTypes = {
  // builtin
  LINK: 'link',
  TEXT: 'text',
  EM: 'em',
  STRONG: 'strong',
  DEL: 'del',
  CODE_BLOCK: 'codeBlock',
  INLINE_CODE: 'inlineCode',
  NEWLINE: 'newline',
  PARAGRAPH: 'paragraph',
  BLOCK_QUOTE: 'blockQuote',
  URL: 'url',
  IMAGE: 'image',
  // custom
  MENTION: 'mention',
  HAIL: 'hail',
  EMOJI: 'emoji',
  EMOTICON: 'emoticon',
}
