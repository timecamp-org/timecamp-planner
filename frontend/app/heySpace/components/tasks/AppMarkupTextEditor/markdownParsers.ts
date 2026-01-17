export const parseAppMarkupToMarkdown = (text: string) => {
  // Replace *Bold* with **Bold**
  text = text.replace(/\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '**$1**');

  // Replace __underline__ with <u>underline</u>
  text = text.replace(/__(?!_)(.*?)(?<!_)__/g, '<u>$1</u>');

  // Replace ~strike~ with ~~strike~~
  text = text.replace(/~(?!\~)(.*?)(?<!\~)~/g, '~~$1~~');

  // Replace _italic_ with *italic*
  text = text.replace(/_(?!_)(.*?)(?<!_)_/g, '*$1*');

  return text;
};

export const parseMarkdownToAppMarkup = (text: string) =>
  text
    .replace(/\*\*([^*]+)\*\*/g, '<bold>$1</bold>') // **bold** -> <bold>bold</bold> temporary transform in order to avoid conflict with italic
    .replace(/\*([^*]+)\*(?!\*)/g, '_$1_') // *italic* -> _italic_
    .replace(/<u>(.*?)<\/u>/g, '__$1__') // <u>underline</u> -> __underline__
    .replace(/~~(.*?)~~/g, '~$1~') // ~~strike~~ -> ~strike~
    .replace(/<bold>(.*?)<\/bold>/g, '*$1*') // <bold>bold</bold> -> *bold*
    .replace(/_~__(.*?)__~_/g, '___~$1~___') // underlined strike italic order
    .replace(/_\*~__(.*?)__~\*_/g, '___~*$1*~___') // italic bold strike underline order to italic
    .replace(/_~(.*?)~_/g, '~_$1_~') // strike italic order to italic strike
    .replace(/_\*(.*?)\*_/g, '*_$1_*'); //  italic bold order to bold italic
