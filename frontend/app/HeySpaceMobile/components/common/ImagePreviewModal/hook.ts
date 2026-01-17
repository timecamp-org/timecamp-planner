import { useDataPersister, useDataProvider } from './dataHooks'

interface ImagePreviewModalHookInterface {
  onCloseModal: VoidFunction,
  isOpen: boolean,
  fileUrl: string,
}

export const useComponent = (): ImagePreviewModalHookInterface => {
  const { isOpen, fileUrl } = useDataProvider()
  const { onCloseModal } = useDataPersister()

  return {
    isOpen, fileUrl, onCloseModal
  }
}