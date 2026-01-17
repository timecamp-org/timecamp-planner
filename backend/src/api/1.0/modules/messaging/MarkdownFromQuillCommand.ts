import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { CommandParameters } from '../console/types'
import { OutputInterface } from '../console/OutputInterface'
import { inject, injectable } from 'inversify'
import { MessagingModule } from './MessagingModule'
import { QuillToMarkdownConverter } from './QuillToMarkdownConverter'

@injectable()
export class MarkdownFromQuillCommand implements ConsoleCommandInterface
{
  protected converter: QuillToMarkdownConverter;

  constructor(
    @inject(MessagingModule.QuillToMarkdownConverter)
    converter : QuillToMarkdownConverter
  ) {
    this.converter = converter;
  }

  async execute(params: CommandParameters, output: OutputInterface): Promise<void> {
    if (params.params.length < 1) {
      throw new Error('Missing quill source text!');
    }
    const quillSrc = params.params[0];

    output.print(this.converter.convert(quillSrc));
  }
}
