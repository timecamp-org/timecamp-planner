import { ProjectDbRow } from "../db/schema";
import { Id } from "../common/identifier";
import { MessageBuilderInterface } from "../messaging/interfaces/MessageBuilderInterface";

export enum CreateBotStatus {
  OK,
  BOT_ALREADY_EXISTS
}

export type CreateBotResult = {
  status: CreateBotStatus,
  botId?: Id
}

export enum CreateSampleSpaceStatus {
  OK,
  SPACE_NOT_CREATED
}

export type CreateSampleSpaceResult = {
  status: CreateSampleSpaceStatus,
  project?: ProjectDbRow,
}

export type BotServiceConfig = {
  initialOnboardingDelaySeconds: number,
  taskCountThreshold: number,
  returningSessionNumber: number,
};

type MessageDefinition = (mb: MessageBuilderInterface) => MessageBuilderInterface;

export enum OnboardingType { WELCOME, TASK_CREATED };
// export type OnboardingType = 'welcome' | 'task-created' | 'returning-session';
export type OnboardingMessageList = {
  [type in OnboardingType]: MessageDefinition[]
}
