import { MarkdownContent, MarkdownOutput, MarkdownState } from "./simpleMarkdownTypings";
import { SimpleMarkdownRendererInterface } from "./interfaces/SimpleMarkdownRendererInterface";
import { AnyDict } from "../common/types";
import { AudienceType } from "../notifications/types";

export type TextFlags = 'bold' | 'italic' | 'underline';

export const NEW_LINE = "\n";

export type TextAttributes = {
  [attr in TextFlags] : boolean
}

export type messageBuilderFactoryType = 'quill'|'markdown'


export type MentionType = 'user' | 'here' // | or what?

export type MentionContent = {
  mention: {
    userId: string,
    username: string,
    type: MentionType
    value: string
  }
};
export type EmojiCode =
  'grinning'
  | 'slightly_smiling_face'
;
export type EmojiContent = {
  emoji: {
    id: EmojiCode,
    colons: string
  }
};
export type TextContent = string;
export type InsertContent = TextContent | MentionContent | EmojiContent;
export type InsertAttributeKey = 'bold' | 'italic' | 'underline';
export type InsertAttributes = {
  [attr in InsertAttributeKey]?: boolean
}
export type QuillInsertOperation = {
  /**
   * Content to insert
   */
  insert: InsertContent

  attributes?: InsertAttributes
}
export type QuillOperation = QuillInsertOperation // | AnotherOperation

export type QuillOps = {
  ops: QuillOperation[]
};


export enum MentionTypes {
  USER = 'user',
  HAIL = 'hail',
}

export type Renderer = {
  type: string,
  renderFn: (node: MarkdownContent, output: MarkdownOutput, state: MarkdownState) => string,
  match?: (source: string, state: MarkdownState, prevCapture: string) => string
}

export type MarkdownPrinter = (self: SimpleMarkdownRendererInterface) => Renderer[]

export type ControlCommand = {
  type: string,
  data: AnyDict,
}

export enum ControlCommandTypes {
  RESTART_WEB_APP = 'restart-app',
}

export type NotificationCommandParams = [ AudienceType, string, string ]
