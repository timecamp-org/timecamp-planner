import { PublicUserDbRow } from '../db/schema'
import { getUserNickname } from '../../../../utils'

import {
  DefaultHtmlOutput,
  MarkdownAST,
} from './simpleMarkdownTypings'
import { UserServiceInterface } from '../users/UserServiceInterface';
import { inject, injectable } from 'inversify';
import { UsersModule } from '../users/UsersModule';
import { SimpleMarkdownRendererInterface } from './interfaces/SimpleMarkdownRendererInterface';
import { MarkdownPrinter, MentionTypes } from './types';
import { MessagingModule } from './MessagingModule';

const SimpleMarkdown = require('simple-markdown')

const emoticons = {
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
  '&lt;3': ':heart:', // <3
  '&lt;/3': ':broken_heart:', // </3
  ':*': ':kissing_heart:',
  ':/': ':confused:',
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
}

// matches all specified emoticons (e.g. :p)
const emoticonRegex = new RegExp(`\^\(${Object.keys(emoticons).map(escapeRegExp).join('|')}\)`, 'i')
// matches all user mention entities (e.g. <@25a6bab6-ab72-4aae-9ef9-6d18359fd3e9>
const mentionRegex = /<@[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}>/g
const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/

@injectable()
export class SimpleMarkdownRenderer implements SimpleMarkdownRendererInterface {
  public usersData: PublicUserDbRow[]
  public mentionColor: string
  private userService: UserServiceInterface
  private parser: (source: string) => MarkdownAST
  private getOutput: (parsedTree: MarkdownAST) => DefaultHtmlOutput

  constructor(
    @inject(UsersModule.UserServiceInterface) userService: UserServiceInterface,
    @inject(MessagingModule.MarkdownPrinter) getBoundRenderers: MarkdownPrinter,
      mentionColor: string = '#bf8ac0'
  ) {
    this.mentionColor = mentionColor
    this.userService = userService
    this.usersData = []

    this.initRules(getBoundRenderers)
  }

  private initRules(getBoundRenderers: MarkdownPrinter): void {
    const rules = {
      ...SimpleMarkdown.defaultRules,
      text: {
        ...SimpleMarkdown.defaultRules.text,
        // regex is from SimpleMarkdown extended with ';' and '#' to make it possible to unescape chars when rendering
        match: SimpleMarkdown.anyScopeRegex(/^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff;#]|\n\n| {2,}\n|\w+:\S|$)/),
      },
      em: {
        ...SimpleMarkdown.defaultRules.em,
        match: SimpleMarkdown.inlineRegex(/^\b_((?:__|\\[\s\S]|[^\\_])+?)_\b/),
      },
      strong: {
        ...SimpleMarkdown.defaultRules.strong,
        match: SimpleMarkdown.inlineRegex(/^\*([\s\S]+?)\*(?!\*)/),
      },
      del: {
        ...SimpleMarkdown.defaultRules.del,
        match: SimpleMarkdown.inlineRegex(/^~(?=\S)([\s\S]*?\S)~/),

      },
      codeBlock: {
        ...SimpleMarkdown.defaultRules.codeBlock,
        match: SimpleMarkdown.anyScopeRegex(/^(`{3})( *?[\s\S]+?)\1/),
      },
      mention: {
        order: SimpleMarkdown.defaultRules.em.order - 0.5,

        // it's mentionRegex but with '^' token (it's needed by SimpleMarkdown)
        match: (source) => /^(<@)[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}>/.exec(source),

        parse: (capture, parse, state) => ({
          type: 'mention',
          userId: capture[0].slice(2, -1),
        }),
      },
      hail: {
        order: SimpleMarkdown.defaultRules.em.order - 0.5,

        match: source => /^(<!)\w+>/.exec(source),

        parse: capture => ({
          type: MentionTypes.HAIL,
          content: capture[0].slice(2, -1),
        }),
      },
      emoji: {
        order: SimpleMarkdown.defaultRules.inlineCode.order - 0.5,

        match: SimpleMarkdown.inlineRegex(/^:\w+:/),

        // TODO: check in Emoji component if :colon_format: actually represents an emoji
        parse: capture => ({
          type: 'emoji',
          colonsEmojiCode: capture[0].toLowerCase(),
        }),
      },
      emoticon: {
        order: SimpleMarkdown.defaultRules.inlineCode.order - 0.5,

        match: source => emoticonRegex.exec(source),

        parse: capture => {
          const colonsEmojiCode = emoticons[capture[0].toLowerCase()]
          return {
            type: 'emoticon',
            isValidEmoji: !!colonsEmojiCode,
            colonsEmojiCode,
            emoticon: capture[0],
          }
        },
      },
    }

    getBoundRenderers(this)
      .forEach(({ type, renderFn, match }) => {
        const currentRule = rules[type]
        if (currentRule) {
          rules[type] = {
            ...currentRule,
            ['html']: renderFn,
            match: match || currentRule.match
          }
        }
      })

    this.parser = SimpleMarkdown.parserFor(rules)
    this.getOutput = SimpleMarkdown.htmlFor(SimpleMarkdown.ruleOutput(rules, 'html'))
  }


  /**
   * Replaces <@user_id> mention strings in inlineCode/codeBlock to corresponding
   * user nicknames
   *
   * @param {string} codeString
   * @returns {string}
   */
  public replaceUserIdsWithUsernamesInRenderedCode(codeString: string): string {
    let codeContent = codeString
    const match = codeContent.match(mentionRegex)
    if (match) {
      match.forEach((userIdMatch) => {
        const userId = userIdMatch.match(uuidRegex)[0] // slice <@ and >
        const userData = this.usersData.find(user => user.id === userId)
        if (userData) {
          const userNickname = getUserNickname(userData)
          codeContent = codeContent.replace(userIdMatch, `@${userNickname}`)
        }
      })
    }

    return codeContent
  }

  /**
   * Replaces <!hail> mention strings in inlineCode/codeBlock to corresponding
   * hail text values
   *
   * @param {string} codeString
   * @returns {string}
   */
  public replaceHailsInRenderedCode(codeString: string = ''): string {

    let codeContent = codeString
    const match = codeContent.match(/(<!)\w+>/)
    if (match) {
      match.forEach(hailEntityString => {
        const hailDisplayValue = hailEntityString.match(/\w+/)[0]
        codeContent = codeContent.replace(hailEntityString, `@${hailDisplayValue}`)
      })
    }

    return codeContent
  }


  public async render(source: string) {
    const maybeUserIds = (source.match(mentionRegex) || [])
      .map(userId => userId.slice(2, -1)) // slice <@ from start and > from end of the string
    if (maybeUserIds.length > 0) {
      this.usersData = await this.userService.getUsersByIds(maybeUserIds, false)
    }
    // Many rules require content to end in \n\n to be interpreted
    // as a block. (via https://github.com/Khan/simple-markdown)
    const blockSource = `${source}\n\n`
    const parsedTree = this.parser(blockSource)
    return this.getOutput(parsedTree)
  }

}
