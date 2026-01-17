import { messageBuilderFactoryType } from "./types";
import { MessageBuilderInterface } from "./interfaces/MessageBuilderInterface";
import { MessageBuilderFactoryInterface } from "./interfaces/MessageBuilderFactoryInterface";
import { QuillMessageBuilder } from "./builders/QuillMessageBuilder";
import { MarkdownMessageBuilder } from "./builders/MarkdownMessageBuilder";
import { injectable } from "inversify";

@injectable()
export class MessageBuilderFactory
  implements MessageBuilderFactoryInterface
{
  createBuilder(type: messageBuilderFactoryType): MessageBuilderInterface {
    if (type === 'quill') {
      return new QuillMessageBuilder()
    } else if (type === 'markdown') {
      return new MarkdownMessageBuilder()
    } else {
      throw new Error(`Not supported messageBuilderType: ${type}`)
    }
  }
}
