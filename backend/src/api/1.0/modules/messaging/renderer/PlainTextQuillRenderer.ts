import { injectable } from "inversify";
import { QuillRendererInterface } from "../interfaces/QuillRendererInterface";
import { EmojiContent, MentionContent, QuillOperation, QuillOps } from "../types";
import { ArrayIterator } from '../../common/ArrayIterator'
import { IteratorInterface } from '../../common/types'
import { assign } from "lodash";

@injectable()
export class PlainTextQuillRenderer
  implements QuillRendererInterface
{
  /**
   * Quill has a weird way of applying text attributes AFTER the text. Such attributes contain insert text of '\n'.
   * We should combine all texts and attributes of quill op with all following attributes with '\n' as text.
   * Attriutes provided are only applied to previous PARAGRAPH (delimited by \n\n), not previous Operation.
   *
   *
   * @param quillOps
   */
  render(quillOps: QuillOps) {
    let result: string = '';

    const splitToParagraphs = this.splitParagraphs(new ArrayIterator(quillOps.ops));
    const combinedOps: QuillOperation[] = this.combineOps(new ArrayIterator(splitToParagraphs));

    for (let op of combinedOps) {
      result += this.renderOp(op);
    }

    return result;
  }

  protected renderOp(op: QuillOperation) {
    let txt: string;
    if (typeof op.insert === 'string') {
      txt = op.insert;
    } else {
      if ((<MentionContent>(op.insert)).mention) {
        const mention = (<MentionContent>(op.insert)).mention;
        if (mention.type === 'here') {
          txt = '@here';
        } else {
          txt = '@' + (mention.username || mention.value);
        }
      } else if ((<EmojiContent>(op.insert)).emoji) {
        const emoji = (<EmojiContent>(op.insert)).emoji;
        txt = emoji.colons;
      } else {
        txt = '';
      }
    }

    txt = this.decorateString(txt, op);

    return txt;
  }

  protected decorateString(txt: string, op: QuillOperation) {
    return txt;
  }

  private splitParagraphs(ops: IteratorInterface<QuillOperation>): QuillOperation[] {
    const lines: QuillOperation[] = [];

    while (ops.current) {
      const op = ops.current;

      if (op.insert === '\n' || typeof op.insert !== 'string') {
        lines.push(op);
      } else {
        // const src = op.insert.trim();
        const paragraphs = op.insert.split('\n\n');
        paragraphs.forEach(srcTxt =>
          {
            lines.push({
              insert: srcTxt,
              attributes: op.attributes
            });
            lines.push({
              insert: '\n\n',
              attributes: op.attributes
            });
          }
        );
        lines.splice(lines.length - 1);
      }

      ops.next();
    }

    return lines;
  }

  private combineOps(ops: IteratorInterface<QuillOperation>): QuillOperation[] {
    const combined: QuillOperation[] = [];
    let op: QuillOperation | null;
    while (op = this.combineOneOp(ops)) {
      combined.push(op);
    }

    return combined;
  }

  private combineOneOp(ops: IteratorInterface<QuillOperation>): QuillOperation {
    const combined: QuillOperation | null = ops.current;
    ops.next();

    let next: QuillOperation | null = ops.current;

    while (next && next.insert === '\n') {
      combined.attributes = assign(combined.attributes, next.attributes);
      combined.insert += next.insert;
      ops.next();
      next = ops.current;
    }

    return combined;
  }

}
