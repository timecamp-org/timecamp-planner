import { Id } from "../../../../common/utils/identifier"
import {
  selectFileHeight,
  selectFileWidth,
  selectFileContentType,
  selectFileUrl,
} from '../../../../common/models/domain/FilesModel/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import * as ModalsModel from '../../../../common/models/component/ModalsModel/actions'
import { ModalType } from '../../../../common/models/component/ModalsModel/types'

export type DataProviderHookInterface = {
  fileHeight: number,
  fileWidth: number,
  fileContentType: string,
  fileUrl: string,
}

export function useDataProvider(fileId: Id): DataProviderHookInterface {
  return {
    //@ts-ignore
    fileHeight: useSelector(state => selectFileHeight(state, { fileId })),
    //@ts-ignore
    fileWidth: useSelector(state => selectFileWidth(state, { fileId })),
    //@ts-ignore
    fileContentType: useSelector(state => selectFileContentType(state, { fileId })),
    //@ts-ignore
    fileUrl: useSelector(state => selectFileUrl(state, { fileId })),
  }
}

type DataPersisterHookInput = {
  fileUrl: string,
}

type DataPersisterHookInterface = {
  onOpenImagePreviewModal: VoidFunction
}

export function useDataPersister({ fileUrl }: DataPersisterHookInput): DataPersisterHookInterface {
  const dispatch = useDispatch()

  return {
    onOpenImagePreviewModal: useCallback(() => (
      dispatch(ModalsModel.onOpenModal(ModalType.MOBILE_IMAGE_VIEW_MODAL, { fileUrl }))
    ), [dispatch])
  }
}