// Taken from https://github.com/Khan/simple-markdown/pull/37
// After that PR is merged this file can be deleted
// & we can use builtin typing and extend them if needed
// (for example MarkdownContent is extended with our own userId field etc)

export type DefaultHtmlOutput = (ast: MarkdownAST, state?: MarkdownState) => Object[];

export type MarkdownAST = MarkdownContent[] | MarkdownContent | string;
export interface MarkdownBaseNode {
  type: string;
  cells?: MarkdownContent[][];
  items?: MarkdownContent[];
  header?: MarkdownContent[];
  level?: number;
  ordered?: boolean;
  target?: string;
}
export interface MarkdownContent extends MarkdownBaseNode {
  content: string;
  // our custom fields:
  userId?: string,
  colonsEmojiCode?: string,
  emoticon?: string,
}
export interface MarkdownNode extends MarkdownBaseNode {
  content: MarkdownContent[];
}

export type MarkdownState = {
  key?: string;
  inline?: boolean;
  withinText?: boolean;
};

export type ImplicitParser = (source: string) => MarkdownAST;
export type ParseHelper = (parse: ImplicitParser, content: string, state: MarkdownState) => MarkdownAST;
export type Parser = (source: string, state: MarkdownState) => MarkdownAST;
export type RegExHelper = (regExp: RegExp) => (source: string, state: MarkdownState) => number[] | null;

export type MarkdownOutput = (ast: MarkdownAST, state: MarkdownState) => string;
export interface MarkdownRules {
  [markdownElementKey: string]: {
    react: RuleFunction;
  };
}
export type RuleASTFunction = (ast: MarkdownAST, output: MarkdownOutput, state: MarkdownState) => string;
export type RuleFunction = (node: MarkdownNode | MarkdownContent, output: MarkdownOutput, state: MarkdownState) => string;