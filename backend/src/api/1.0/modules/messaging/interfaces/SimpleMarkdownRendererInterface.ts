import { PublicUserDbRow } from "../../db/schema";
import { DefaultHtmlOutput } from "../simpleMarkdownTypings";

export interface SimpleMarkdownRendererInterface {
  replaceUserIdsWithUsernamesInRenderedCode(code: string): string
  replaceHailsInRenderedCode(code: string): string
  render(source: string): Promise<DefaultHtmlOutput>
  usersData: PublicUserDbRow[]
  mentionColor: string
}
