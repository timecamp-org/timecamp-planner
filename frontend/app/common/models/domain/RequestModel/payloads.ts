import { Id } from 'common/utils/identifier';

export interface OnFetchSpaceOrConversationViewDataPayload {
  objectId: Id, 
  filterId?: Id,
  force?: boolean, 
  purgeTasksOrder?: boolean,
}
export interface OnFetchProjectViewDataPayload {
  projectId: Id, 
  queryParams?: {
    fetchArchived?: boolean,
  },
  purgeTasksOrder?: boolean, 
}