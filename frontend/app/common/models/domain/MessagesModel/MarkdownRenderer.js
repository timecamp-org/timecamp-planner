import SimpleMarkdown from 'simple-markdown';
import { List } from 'immutable';
import { escapeRegExp } from '../../../utils';
import { emoticons, react, markdownEntityTypes } from './markdownConstants';
import unescape from 'lodash/unescape';
import emoji from 'node-emoji';

export const mentionRegex = /<@[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}>/g;
export const emojiRegex = /^:(?!http)[+\-\w]+:(:skin-tone-\d:)?/;
export const hailRegex = /(<!)\w+>/g;
export const emoticonRegex = new RegExp(`\^\(${Object.keys(emoticons).map(escapeRegExp).join('|')}\)`, 'i');
export const urlRegex = /^(https?:\/\/[^\s<]+[^<.,:;"'\]\s])/;

const defaultConfig = {
  userNicknamesByIds: new List(),
  getBoundRenderers: () => [],
  mentionColor: '#2d80eb',
  shouldUseDefaultRules: true,
};

export default class MarkdownRenderer {
  constructor(config) {
    config = {
      ...defaultConfig,
      ...config,
    };
    this.userNicknamesByIds = config.userNicknamesByIds;
    this.mentionColor = config.mentionColor;

    const defaultRules = config.shouldUseDefaultRules ? SimpleMarkdown.defaultRules : {};
    // TODO: default reflink regex is incorrect so we disable it here, we should create own good regex
    delete defaultRules.reflink;

    const { escape, ...filteredDefaultRules } = defaultRules;

    const rules = {
      ...filteredDefaultRules,
      [markdownEntityTypes.TEXT]: {
        ...SimpleMarkdown.defaultRules.text,
      },
      [markdownEntityTypes.LINK]: {
        ...SimpleMarkdown.defaultRules.link,
      },
      [markdownEntityTypes.IMAGE]: {
        ...SimpleMarkdown.defaultRules.image,
      },
      [markdownEntityTypes.PARAGRAPH]: {
        ...SimpleMarkdown.defaultRules.paragraph,
      },
      [markdownEntityTypes.BLOCK_QUOTE]: {
        ...SimpleMarkdown.defaultRules.blockQuote,
        match: SimpleMarkdown.blockRegex(/^( *(> ?)+[^\n]+(\n[^\n]+)*\n*)+\n{2,}/),
        parse: (capture, parse, state) => {
          const content = capture[0].replace(/^ *(> ?)+/gm, '');
          const parsedContent = parse(content, state);
          return {
            type: markdownEntityTypes.BLOCK_QUOTE,
            content: parsedContent,
          };
        },
      },
      [markdownEntityTypes.URL]: {
        ...SimpleMarkdown.defaultRules.url,
        match: SimpleMarkdown.inlineRegex(urlRegex),
      },
      [markdownEntityTypes.EM]: {
        ...SimpleMarkdown.defaultRules.em,
        match: SimpleMarkdown.inlineRegex(/^\b_([^_]*)_\b/),
      },
      [markdownEntityTypes.STRONG]: {
        ...SimpleMarkdown.defaultRules.strong,
        match: SimpleMarkdown.inlineRegex(/^\*([^*]+(\s\S^\*+)*)\*/),
      },
      [markdownEntityTypes.DEL]: {
        ...SimpleMarkdown.defaultRules.del,
        match: SimpleMarkdown.inlineRegex(/^~(?=\S)([\s\S]*?\S)~/),
      },
      [markdownEntityTypes.INLINE_CODE]: {
        ...SimpleMarkdown.defaultRules.inlineCode,
      },
      [markdownEntityTypes.CODE_BLOCK]: {
        ...SimpleMarkdown.defaultRules.codeBlock,
        match: SimpleMarkdown.anyScopeRegex(/^(`{3})(\n?)( *?[\s\S]+?)\1/),
      },
      [markdownEntityTypes.MENTION]: {
        order: SimpleMarkdown.defaultRules.em.order - 0.5,

        match: (source) =>
          /^(<@)[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}>/.exec(source),

        parse: (capture, parse, state) => ({
          type: markdownEntityTypes.MENTION,
          userId: capture[0].slice(2, -1),
        }),
      },
      [markdownEntityTypes.HAIL]: {
        order: SimpleMarkdown.defaultRules.em.order - 0.5,

        match: (source) => /^(<!)\w+>/.exec(source),

        parse: (capture) => ({
          type: markdownEntityTypes.HAIL,
          content: capture[0].slice(2, -1),
        }),
      },
      [markdownEntityTypes.EMOJI]: {
        order: SimpleMarkdown.defaultRules.inlineCode.order - 0.5,

        match: (source, state) => {
          const match = SimpleMarkdown.inlineRegex(emojiRegex)(source, state);
          if (match) {
            const isEmoji = emoji.hasEmoji(match[0]);
            return isEmoji ? match : undefined;
          }
          return match;
        },

        // TODO: check in Emoji component if :colon_format: actually represents an emoji
        parse: (capture) => ({
          type: markdownEntityTypes.EMOJI,
          colonsEmojiCode: capture[0].toLowerCase(),
        }),
      },
      [markdownEntityTypes.EMOTICON]: {
        order: SimpleMarkdown.defaultRules.inlineCode.order - 0.5,

        match: (source) => emoticonRegex.exec(source),

        parse: (capture) => {
          const colonsEmojiCode = emoticons[capture[0].toLowerCase()];
          return {
            type: markdownEntityTypes.EMOTICON,
            isValidEmoji: !!colonsEmojiCode,
            colonsEmojiCode,
          };
        },
      },
    };

    config.getBoundRenderers(this).forEach(({ type, renderFn }) => {
      const currentRule = rules[type];
      if (currentRule) {
        rules[type] = {
          ...currentRule,
          react: renderFn,
          render: renderFn,
        };
      }
    });

    this.getRules = () => rules;
    this.parser = SimpleMarkdown.parserFor(rules);
    this.getOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, react));
  }

  replaceUserIdsWithUsernamesInRenderedCode = (codeString = '') => {
    let codeContent = codeString;
    const match = codeContent.match(mentionRegex);
    if (match) {
      match.forEach((mentionEntityString) => {
        const maybeUserId = mentionEntityString.slice(2, -1);
        const userNickname = this.userNicknamesByIds.get(maybeUserId);

        if (userNickname) {
          codeContent = codeContent.replace(mentionEntityString, `@${userNickname}`);
        }
      });
    }

    return codeContent;
  };

  replaceHailsInRenderedCode = (codeString = '') => {
    let codeContent = codeString;
    const match = codeContent.match(hailRegex);
    if (match) {
      match.forEach((hailEntityString) => {
        const hailDisplayValue = hailEntityString.slice(2, -1);
        codeContent = codeContent.replace(hailEntityString, `@${hailDisplayValue}`);
      });
    }

    return codeContent;
  };

  getRenderableOutput = (source, mentionColor) => {
    if (mentionColor) {
      this.mentionColor = mentionColor;
    }
    const unescapedSource = unescape(source);
    const parsedTree = this.getAST(unescapedSource);
    const outputResult = this.getOutput(parsedTree);
    return outputResult;
  };

  getAST(source) {
    // Many rules require content to end in \n\n to be interpreted as a block.
    // ^(via simple-markdown github)
    const blockSource = `${source}\n\n`;
    return this.parser(blockSource);
  }
}
