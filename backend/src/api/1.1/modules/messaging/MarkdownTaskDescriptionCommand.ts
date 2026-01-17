import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { CommandParameters } from '../console/types'
import { OutputInterface } from '../console/OutputInterface'
import { inject, injectable } from 'inversify'
import { DbModule } from '../db/DbModule'
import Table from '../db/Table'
import { TaskDbRow } from '../db/schema'
import { PropertiesOfType } from '../common/types'
import { QuillToMarkdownConverter } from './QuillToMarkdownConverter'
import { MessagingModule } from './MessagingModule'
import { TableColumnConverter } from '../db/TableColumnConverter'

@injectable()
export class MarkdownTaskDescriptionCommand
  implements ConsoleCommandInterface
{
  protected converter: QuillToMarkdownConverter;
  protected tableConverter: TableColumnConverter;

  constructor(
    @inject(MessagingModule.QuillToMarkdownConverter)
      converter: QuillToMarkdownConverter,
    @inject(DbModule.TableColumnConverter)
      tableConverter: TableColumnConverter,
  ) {
    this.converter = converter;
    this.tableConverter = tableConverter;
  }

  async execute(params: CommandParameters, out: OutputInterface): Promise<void> {

    await this.tableConverter.convert(
      Table.TASK,
      [ 'description' ],
      this.convertQuillToMarkdown.bind(this, out)
    )
  }

  protected async convertQuillToMarkdown(
    out: OutputInterface,
    input: string,
    column: PropertiesOfType<TaskDbRow, string>,
    row: TaskDbRow
  ) {
    try {
      const result = this.converter.convert(input);

      out.print(`[${row.id}] ${column}: converted `);

      return result;

    } catch (e) {
      out.print(`[${row.id}] ${column}:invalid json -- not a quill source `);
    }
    finally {
      out.print("\n");
    }
  }
}
