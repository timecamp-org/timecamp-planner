import { ProjectType } from 'models/domain/ProjectsModel/types'
import isEmpty from 'lodash/isEmpty'
import { FIRST_PROJECT_PLACEHOLDER_PATH } from 'models/domain/ProjectsModel/constants'
import getSpaceUrl from './getSpaceUrl'
import { FirstProjectInterface } from 'common/types'

export function getFirstProjectUrl(firstProject?: FirstProjectInterface): string {
  if (isEmpty(firstProject)) {
    return FIRST_PROJECT_PLACEHOLDER_PATH
  }

  switch (firstProject.projectType) {
    case ProjectType.DIRECT_CHAT:
    case ProjectType.GROUP_CHAT: {
      return `/conversations/${firstProject.conversationHash}`
    }
    case ProjectType.PROJECT: {
      return getSpaceUrl(firstProject.projectId)
    }
    default: {
      return FIRST_PROJECT_PLACEHOLDER_PATH
    }
  }
}
