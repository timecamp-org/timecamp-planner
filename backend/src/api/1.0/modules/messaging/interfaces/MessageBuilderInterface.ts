import { TextAttributes, EmojiCode } from "../types";

export interface MessageBuilderInterface
{
  add(text: string, attr?: TextAttributes) : this;
  emoji(emojiCode: EmojiCode) : this;
  newLine(): this;
  getTextSource(): string;
}
