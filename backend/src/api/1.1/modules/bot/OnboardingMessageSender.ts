import { MessageContainerType, PublicUserDbRow } from '../db/schema';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { MessageServiceInterface } from '../messages/interfaces/MessageServiceInterface';
import { MessageJson } from '../messages/types';
import { injectable, inject } from 'inversify';
import { MessagesModule } from '../messages/MessagesModule';
import { CommonModule } from '../common/CommonModule';
import { SchedulerInterface } from '../common/scheduler/SchedulerInterface';
import { MessageBuilderFactoryInterface } from '../messaging/interfaces/MessageBuilderFactoryInterface';
import { MessagingModule } from '../messaging/MessagingModule';
import { OnboardingMessageList, OnboardingType } from './types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { BotModule } from './BotModule';

const MESSAGES: OnboardingMessageList = {
  [OnboardingType.WELCOME]: [
    /* mb: MessageBuilderInterface */
    (mb) =>
      mb
        .add('Welcome to Hey Space! Pleasure to meet you.')
        .newLine()
        .add('I’m your own Space bot ')
        .emoji('grinning')
        .add(' Please let me give you some tips about TimeCamp Planner. Right now, you can reach me via Intercom!')
        .newLine()
        .newLine()
        .add(
          'Before you start exploring, you might want to take a look at our application overview available here: https://hey.space/application-overview'
        )
        .newLine()
        .newLine()
        .add('- to find a Space or a Team Member you can use ctrl+k (cmd+k) shortcut,')
        .newLine()
        .add(
          '- to create a new line in a description, please use double space sign at the end of a previous sentence,  '
        )
        .newLine()
        .add('- information about our apps and integrations: https://hey.space/apps')
        .newLine()
        .add('- tags are managed in the Settings menu,')
        .newLine()
        .add('- to create a card out of a message just click on arrow icon which shows up when your cursor is on it.')
        .newLine()
        .newLine()
        .add('There are a few ways to invite users:')
        .newLine()
        .newLine()
        .add('- invite with a plus button on main menu,')
        .newLine()
        .add('- invite members directly into space,')
        .newLine()
        .add('- invite through mention,')
        .newLine()
        .add('- invite while assigning tasks.')
        .newLine()
        .newLine()
        .add('Enjoy!'),
  ],

  [OnboardingType.TASK_CREATED]: [
    (mb) => mb.add('I’ve seen that you’ve created a few cards. It’s easier to manage them in the board view.'),
    (mb) => mb.add('To try it just click on board’s button on top bar in space.'),
    (mb) => mb.add('All your cards are waiting for you right there ').emoji('slightly_smiling_face'),
    (mb) => mb.add('Don’t wait, try it out! (edited)'),
  ],
};

export type OnboardingMessageSenderOptions = {
  messageSendDelayMs: number;
};

const DEFAULT_OPTIONS: OnboardingMessageSenderOptions = {
  messageSendDelayMs: 1800,
};

@injectable()
export class OnboardingMessageSender {
  protected messageBuilderFactory: MessageBuilderFactoryInterface;
  protected messageService: MessageServiceInterface;
  protected logger: LoggerInterface;
  protected options: OnboardingMessageSenderOptions;
  protected scheduler: SchedulerInterface;
  private idGenerator: IdGeneratorInterface<Id>;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(MessagingModule.MessageBuilderFactoryInterface) messageBuilderFactory: MessageBuilderFactoryInterface,
    @inject(MessagesModule.MessageServiceInterface) messageService: MessageServiceInterface,
    @inject(CommonModule.IdGeneratorInterface) idGenerator: IdGeneratorInterface<Id>,
    @inject(CommonModule.SchedulerInterface) scheduler: SchedulerInterface,
    @inject(BotModule.OnboardingMessageSenderOptions) options?: OnboardingMessageSenderOptions
  ) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.scheduler = scheduler;
    this.logger = logger;
    this.messageBuilderFactory = messageBuilderFactory;
    this.messageService = messageService;
    this.idGenerator = idGenerator;
  }

  public async sendOnboardingMessages(type: OnboardingType, conversationId: Id, bot: PublicUserDbRow) {
    const messages = MESSAGES[type];

    const messageJsons: MessageJson[] = messages.map((md) => ({
      containerType: MessageContainerType.PROJECT,
      containerId: conversationId,
      content: md(this.messageBuilderFactory.createBuilder('markdown')).getTextSource(),
      isLinkPreviewEnabled: false,
    }));
    if (messageJsons.length === 0) {
      this.logger.warn(`No onboarding messages defined for type ${type}`);
      return;
    }

    messageJsons.forEach(async (messageJson, index) => {
      this.scheduler.setTimeout(this.options.messageSendDelayMs * index, () =>
        this.messageService.createMessage(this.idGenerator.generateId(), bot.id, messageJson)
      );
    });
  }
}
