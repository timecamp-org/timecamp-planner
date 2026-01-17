import { QuillRendererInterface } from '../../messaging/interfaces/QuillRendererInterface';
import { JsonParserType } from '../../../../../utils';
import { DateFormatterServiceInterface } from '../../common/date/DateFormatterServiceInterface';
import { injectable } from 'inversify';
import { isQuillMessage } from '../../messaging/helpers'

// TODO: remove quillRenderer some time after successful frontend & backend deploy
// quillRenderer is left here in case someone didn't refresh frontend app after deploy ->
// backend will receive message in old Quill format

@injectable()
export abstract class AbstractNotificationContentProvider
{
  protected dateFormatter: DateFormatterServiceInterface;
  protected quillRenderer: QuillRendererInterface;
  protected fromJson : JsonParserType;
  protected markdownRenderer

  protected constructor(
    dateFormatter: DateFormatterServiceInterface,
    quillRenderer: QuillRendererInterface,
    fromJson: JsonParserType,
    markdownRenderer,
  ) {
    this.dateFormatter = dateFormatter
    this.quillRenderer = quillRenderer
    this.fromJson = fromJson
    this.markdownRenderer = markdownRenderer
  }

  protected async renderMessage(messageValue: string) {
    if (!messageValue) {
      return '';
    }

    const isQuillFormat = isQuillMessage(messageValue)
    const parsedMessageValue = this.fromJson(messageValue);

    if (isQuillFormat) {
      return this.quillRenderer.render(parsedMessageValue);
    } else if (!parsedMessageValue) {
      return ''
    } else {
      return await this.markdownRenderer.render(messageValue)
    }
  }
}
