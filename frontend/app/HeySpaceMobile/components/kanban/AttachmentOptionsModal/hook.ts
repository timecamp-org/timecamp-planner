import { AttachmentOptionsModalInterface } from './index'
import { useDataProvider } from './dataHooks'
import useFileDownload from '../../../hooks/useFileDownload/useFileDownload'

export type AttachmentOptionsModalHookInterface = {
  canUserDeleteAttachment: boolean,

  onDownloadFile: VoidFunction
  onShowDeleteConfirmationModal: VoidFunction
}

export const useComponent = (
  props: AttachmentOptionsModalInterface
): AttachmentOptionsModalHookInterface => {

  const {
    fileName,
    fileUrl,
    currentUserId,
    fileUserId,
  } = useDataProvider(props)

  const canUserDeleteAttachment = currentUserId === fileUserId

  const onDownloadFile = () => {
    props.onClose()
    useFileDownload().onDownloadFile(fileName, fileUrl)
  }

  const onShowDeleteConfirmationModal = () => {
    props.onClose()
    props.onShowDeleteConfirmationModal()
  }

  return {
    canUserDeleteAttachment,

    onDownloadFile,
    onShowDeleteConfirmationModal,
  }
}