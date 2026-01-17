import { AttachmentOptionsModalInterface } from './index'
import { useSelector } from '../../../../common/hooks/useSelector'
import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'
import { selectCurrentUserId } from '../../../../common/models/domain/UsersModel/selectors/domain'
import { Id } from '../../../../common/utils/identifier'

type DataProviderInterface = {
  fileName: string,
  fileUrl: string,
  currentUserId: Id,
  fileUserId: Id,
}

export const useDataProvider = (
  props: AttachmentOptionsModalInterface
): DataProviderInterface => {
  return {
    // @ts-ignore
    fileUrl: useSelector(state => FilesModelSelectors.selectFileUrl(state, { fileId: props.attachmentId })),
    // @ts-ignore
    fileName: useSelector(state => FilesModelSelectors.selectFileName(state, { fileId: props.attachmentId })),
    currentUserId: useSelector(state => selectCurrentUserId(state)),
    // @ts-ignore
    fileUserId: useSelector(state => FilesModelSelectors.selectFileUserId(state, { fileId: props.attachmentId })),
  }
}