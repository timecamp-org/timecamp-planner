import { TextAttributes, NEW_LINE, QuillOperation, QuillOps, EmojiCode } from '../types';
import { toJson } from '../../../../../utils';
import { MessageBuilderInterface } from '../interfaces/MessageBuilderInterface';
import { injectable } from 'inversify';

// TODO: delete QuillMessageBuilder
@injectable()
export class QuillMessageBuilder implements MessageBuilderInterface {
  protected ops : QuillOperation[];

  constructor() {
    this.ops = [];
  }

  add(text: string, attr?: TextAttributes): this {
    this.ops.push({
      insert: text
    })
    return this;
  }

  getTextSource(): string {
    const ops : QuillOps = {
      ops: this.ops
    }
    return toJson(ops);
  }

  newLine(): this {
    this.ops.push({
      insert: NEW_LINE
    })
    return this;
  }

  emoji(emojiCode: EmojiCode): this {
    this.ops.push({
      insert: {
        emoji: {
          id: emojiCode,
          colons: `:${emojiCode}:`
        }
      }
    })
    return this;
  }
}
