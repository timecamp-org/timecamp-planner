import { MessageBuilderInterface } from "../interfaces/MessageBuilderInterface";
import { EmojiCode } from "../types";
import { injectable } from "inversify";

@injectable()
export class MarkdownMessageBuilder implements MessageBuilderInterface {
  protected messageText: string;

  constructor() {
    this.messageText = '';
  }

  add(text: string): this {
    this.messageText += text
    return this;
  }

  getTextSource(): string {
    return this.messageText;
  }

  newLine(): this {
    this.messageText += '\n'
    return this;
  }

  emoji(emojiCode: EmojiCode): this {
    this.messageText += `:${emojiCode}:`;
    return this;
  }
}
