export enum ChatItemsType {
  All = 'All',
  Messages = 'Messages',
  Actions = 'Actions',
}

const SELECTOR_ITEMS_CONFIG = {
  [ChatItemsType.All]: {
    withActivities: true,
    withMessages: true,
  },
  [ChatItemsType.Actions]: {
    withActivities: true,
    withMessages: false,
  },
  [ChatItemsType.Messages]: {
    withActivities: false,
    withMessages: true,
  },
};

export const getMessageSelectorItemTypeConfig = (itemType?: ChatItemsType) =>
  itemType ? SELECTOR_ITEMS_CONFIG[itemType] : SELECTOR_ITEMS_CONFIG[ChatItemsType.All];
