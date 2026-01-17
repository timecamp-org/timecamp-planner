import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { MessagingModule } from './MessagingModule';
import { MessageBuilderFactoryInterface } from './interfaces/MessageBuilderFactoryInterface';
import { MarkdownMessageBuilder } from './builders/MarkdownMessageBuilder';
import { MessageBuilderInterface } from './interfaces/MessageBuilderInterface';
import { QuillMessageBuilder } from './builders/QuillMessageBuilder';
import { MessageBuilderFactory } from './MessageBuilderFactory';
import { SimpleMarkdownRendererInterface } from './interfaces/SimpleMarkdownRendererInterface';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { QuillRendererInterface } from './interfaces/QuillRendererInterface';
import { DecoratingQuillRenderer } from './renderer/DecoratingQuillRenderer';
import { PlainTextQuillRenderer } from './renderer/PlainTextQuillRenderer';
import getPlainTextRenderers from './markdownToPlainTextRenderers';
import getHtmlRenderers from './markdownToHtmlRenderers';
import { UsersModule } from '../users/UsersModule';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { MarkdownFromQuillCommand } from './MarkdownFromQuillCommand'
import { ConsoleModule } from '../console/ConsoleModule'
import { CommandConfig } from '../console/types'
import { HTML_DECORATORS, MARKDOWN_DECORATORS, TextDecorators } from './renderer/types'
import { QuillToMarkdownConverter } from './QuillToMarkdownConverter'
import { MarkdownTaskDescriptionCommand } from './MarkdownTaskDescriptionCommand'
import { WebControlCommand } from './WebControlCommand';
import { ControlCommandFactory } from './ControlCommandFactory';
import { ControlCommandFactoryInterface } from './interfaces/ControlCommandFactoryInterface';
import { NotificationCommand } from './NotificationCommand';

export const messagingModule: ModuleLoaderType = kernel => {
  kernel.bind<MessageBuilderFactoryInterface>(MessagingModule.MessageBuilderFactoryInterface).to(MessageBuilderFactory);
  kernel.bind<MessageBuilderInterface>(MessagingModule.MessageBuilderInterface).to(MarkdownMessageBuilder);
  kernel.bind<MessageBuilderInterface>(MessagingModule.MessageBuilderInterface).to(QuillMessageBuilder);

  kernel.bind<ControlCommandFactoryInterface>(MessagingModule.ControlCommandFactoryInterface).to(ControlCommandFactory);

  kernel.bind<SimpleMarkdownRendererInterface>(MessagingModule.SimpleMarkdownRendererInterface)
    .toDynamicValue(ctx => {
      const userService = ctx.container.get<UserServiceInterface>(UsersModule.UserServiceInterface);
      return new SimpleMarkdownRenderer(userService, getPlainTextRenderers)
    })
    .inSingletonScope()
    .whenTargetNamed('PlainRenderer')
  ;

  kernel.bind<SimpleMarkdownRendererInterface>(MessagingModule.SimpleMarkdownRendererInterface)
    .toDynamicValue(ctx => {
      const userService = ctx.container.get<UserServiceInterface>(UsersModule.UserServiceInterface);
      return new SimpleMarkdownRenderer(userService, getHtmlRenderers)
    })
    .inSingletonScope()
    .whenTargetNamed('HtmlRenderer');

  kernel.bind<QuillRendererInterface>(MessagingModule.QuillRendererInterface)
    .to(PlainTextQuillRenderer)
    .whenTargetNamed('PlainText')
  ;
  kernel.bind<QuillRendererInterface>(MessagingModule.QuillRendererInterface)
    .to(DecoratingQuillRenderer)
    .whenTargetNamed('Html')
  ;
  kernel.bind<QuillRendererInterface>(MessagingModule.QuillRendererInterface)
    .to(DecoratingQuillRenderer)
    .whenTargetNamed('Markdown')
  ;
  kernel.bind<TextDecorators>(MessagingModule.QuillRendererDecorators)
    .toConstantValue(HTML_DECORATORS)
    .whenParentNamed('Html')
  ;
  kernel.bind<TextDecorators>(MessagingModule.QuillRendererDecorators)
    .toConstantValue(MARKDOWN_DECORATORS)
    .whenParentNamed('Markdown')
  ;

  kernel.bind<QuillToMarkdownConverter>(MessagingModule.QuillToMarkdownConverter)
    .to(QuillToMarkdownConverter)
  ;

  kernel.bind<ConsoleCommandInterface>(MessagingModule.MarkdownFromQuillCommand)
    .to(MarkdownFromQuillCommand);

  kernel.bind<ConsoleCommandInterface>(MessagingModule.MarkdownTaskDescriptionCommand)
    .to(MarkdownTaskDescriptionCommand);

  kernel.bind<ConsoleCommandInterface>(MessagingModule.WebControlCommand)
    .to(WebControlCommand);

  kernel.bind<ConsoleCommandInterface>(MessagingModule.NotificationCommand)
    .to(NotificationCommand);

  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'markdown:from-quill',
    description: 'Generated markdown (HeySpace flavor) based on provided Quill json string',
    serviceId: MessagingModule.MarkdownFromQuillCommand,
  });

  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'markdown:all-task-descriptions',
    description: 'Scans all "project-management"."task" rows and converts description to markdown if legacy quill-ops format is detected',
    serviceId: MessagingModule.MarkdownTaskDescriptionCommand,
  });

  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'system:control-command',
    description: 'Sends signal with special command to main api process, for example "restart-app" which tells connected sockets to refresh their browsers.',
    serviceId: MessagingModule.WebControlCommand,
  });
  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'system:notification',
    description: 'Sends push notification to specific audience type (all/online) with specified title and content.',
    serviceId: MessagingModule.NotificationCommand,
  });
}
