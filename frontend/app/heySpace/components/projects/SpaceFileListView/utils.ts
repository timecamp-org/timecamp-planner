import { HeySpaceClient as client } from 'common/services';
import { Id } from 'common/utils/identifier';

import { FileData } from './types';

export const fetchProjectFilesRequest = (projectId: Id): Promise<FileData[]> =>
  new Promise((res) => {
    client.restApiClient.getProjectFiles(projectId, (_, resp) => res(resp));
  });

export const deleteFileRequest = (fileId: Id) =>
  new Promise((res) => client.restApiClient.removeFile(fileId, (_, resp) => res(resp)));
