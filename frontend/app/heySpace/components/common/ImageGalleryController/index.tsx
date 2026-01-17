import React, { lazy } from 'react'
import { ImageGalleryType } from 'models/domain/FilesModel/types'
import useComponent from './hook'

const TaskAttachmentsGallery = lazy(() => import('components/chat/ImageGallery/taskAttachmentsGallery'))
const ProjectMessageAttachmentsGallery = lazy(() => import('components/chat/ImageGallery/projectMessageAttachmentsGallery'))
const TaskMessageAttachmentsGallery = lazy(() => import('components/chat/ImageGallery/taskMessageAttachmentsGallery'))

const ImageGalleryController = () => {
  const hook = useComponent()
  if (!(hook.imageGalleryObjectId && hook.isCurrentUserAuthenticated)) {
    return null
  }

  switch (hook.imageGalleryType) {
    case ImageGalleryType.TASK_ATTACHMENT: {
      return (
        <TaskAttachmentsGallery objectId={hook.imageGalleryObjectId} />
      )
    }
    case ImageGalleryType.TASK_MESSAGE_ATTACHMENT: {
      return (
        <TaskMessageAttachmentsGallery objectId={hook.imageGalleryObjectId} />
      )
    }
    case ImageGalleryType.PROJECT_MESSAGE_ATTACHMENT: {
      return (
        <ProjectMessageAttachmentsGallery objectId={hook.imageGalleryObjectId} />
      )
    }
    default: {
      return null
    }
  }
}

export default ImageGalleryController
