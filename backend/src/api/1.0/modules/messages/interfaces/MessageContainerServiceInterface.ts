import { MessageDbRow, MessageContainerType } from "../../db/schema";
import { MessageContainerInstance, MessageContainer, MessageContainerDefinition } from "../types";
import { Id } from "../../common/identifier";

export interface MessageContainerServiceInterface {
  getContainerInstance(message: Partial<MessageDbRow>): Promise<MessageContainerInstance>

  getContainer(containerType: MessageContainerType, containerId: Id): MessageContainer

  getContainerForMessage(message: Partial<MessageDbRow>): Promise<MessageContainer>

  getContainerDefinition(containerType: MessageContainerType): MessageContainerDefinition

  getInstance(container: MessageContainer): Promise<MessageContainerInstance>

  getOrganizationIdFromContainer(containerType: MessageContainerType, containerId: Id): Promise<Id>
}
