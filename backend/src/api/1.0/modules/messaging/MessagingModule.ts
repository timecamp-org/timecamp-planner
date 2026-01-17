export const MessagingModule = {
  MessageBuilderFactoryInterface: Symbol('MessageBuilderFactoryInterface'),
  MessageBuilderInterface: Symbol('MessageBuilderInterface'),
  QuillRendererInterface: Symbol('QuillRendererInterface'),
  SimpleMarkdownRendererInterface: Symbol('SimpleMarkdownRendererInterface'),
  MarkdownPrinter: Symbol('MarkdownPrinter'),

  QuillToMarkdownConverter: Symbol('QuillToMarkdownConverter'),
  MarkdownFromQuillCommand: Symbol('MarkdownFromQuillCommand'),
  MarkdownTaskDescriptionCommand: Symbol('MarkdownTaskDescriptionCommand'),
  ControlCommandFactoryInterface: Symbol('ControlCommandFactoryInterface'),
  WebControlCommand: Symbol('WebControlCommand'),
  NotificationCommand: Symbol('NotificationCommand'),

  QuillRendererDecorators: Symbol('QuillRendererDecorators'),
}
