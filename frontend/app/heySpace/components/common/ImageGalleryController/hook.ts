import { useSelector } from 'common/hooks/useSelector'
import { selectImageGalleryObjectId, selectImageGalleryType } from 'models/domain/FilesModel/selectors'
import { Id } from 'common/utils/identifier'
import { ImageGalleryType } from 'models/domain/FilesModel/types'
import { isAuthenticated } from 'models/domain/CurrentUserModel/selectors'

export type ImageGalleryControllerHookInterface = {
  imageGalleryObjectId: Id,
  imageGalleryType: ImageGalleryType,
  isCurrentUserAuthenticated: boolean,
}

export default function useComponent(): ImageGalleryControllerHookInterface {
  const imageGalleryObjectId = useSelector(selectImageGalleryObjectId)
  const imageGalleryType = useSelector(selectImageGalleryType)
  const isCurrentUserAuthenticated = useSelector(isAuthenticated)

  return {
    imageGalleryObjectId,
    imageGalleryType,
    isCurrentUserAuthenticated
  }
}
