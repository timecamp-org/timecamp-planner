import { OrganizationProjectsQueryParams } from './types';
import { Id } from 'common/utils/identifier';

export interface OnGetOrganizationProjectsPayload {
  params: OrganizationProjectsQueryParams;
  fillWithDefaults?: boolean;
}

export interface OnSetProjectLatestVisitPayload {
  projectId: Id;
}

export interface OnCreateProjectFilesPayload {
  projectId: Id;
  files: any;
}

export interface OnUploadProjectFilePayload {
  fileId: Id;
  objectId: Id;
  containerId: Id;
}

export interface OnDebounceRefetchProjectFilesPayload {
  projectId: Id;
}
