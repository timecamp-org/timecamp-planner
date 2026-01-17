import { QuillRendererInterface } from './interfaces/QuillRendererInterface'
import { inject, injectable, named } from 'inversify'
import { MessagingModule } from './MessagingModule'
import { QuillOps } from './types'
import { fromJson } from '../../../../utils'

@injectable()
export class QuillToMarkdownConverter
{
  protected renderer: QuillRendererInterface;

  constructor(
    @inject(MessagingModule.QuillRendererInterface)  @named('Markdown')
      renderer : QuillRendererInterface
  ) {
    this.renderer = renderer;
  }

  convert(quillSrc: string): string {
    const quillOps: QuillOps = fromJson(quillSrc);
    if (!quillOps || !quillOps.ops) {
      throw new Error('Incorrect Quill Ops json!');
    }

    //todo check if properly decoded
    return this.renderer.render(quillOps);
  }
}