import { PlainTextQuillRenderer } from "./PlainTextQuillRenderer";
import { QuillOperation } from "../types";
import { inject, injectable } from "inversify";
import { TextDecorators } from "./types";
import { MessagingModule } from '../MessagingModule'

@injectable()
export class DecoratingQuillRenderer
  extends PlainTextQuillRenderer
{
  protected decorators: TextDecorators;

  constructor(
    @inject(MessagingModule.QuillRendererDecorators)
    decorators: TextDecorators
  ) {
    super()
    this.decorators = decorators
  }

  protected decorateString(txt: string, op: QuillOperation): string {
    if (typeof op.insert !== 'string' && this.decorators[ 'mention' ]) {
      txt = this.decorators.mention(txt);
    } else {
      for (let decoration in op.attributes) {
        if (op.attributes[ decoration ] && this.decorators[ decoration ]) {
          txt = this.decorators[ decoration ](txt);
        }
      }
    }
    return txt;
  }
}
