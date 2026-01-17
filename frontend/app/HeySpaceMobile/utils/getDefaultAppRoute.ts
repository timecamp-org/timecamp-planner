import { UrlConfigInterface, AnyDict, FirstProjectInterface } from '../../common/types'
import isEmpty from 'lodash/isEmpty'
import RouteNames from '../components/AppNavigation/routeNames'
import { ProjectType } from '../../common/models/domain/ProjectsModel/types'

export type RouteDefinition = {
  route: string,
  props?: AnyDict,
}

export default function getDefaultAppRoute(data: UrlConfigInterface = {}): RouteDefinition {
  let firstProjectData = data?.firstProjectData
  return getFirstProjectRoute(firstProjectData)
}

function getFirstProjectRoute(firstProjectData?: FirstProjectInterface): RouteDefinition {
  if (isEmpty(firstProjectData)) {
    return {
      route: RouteNames.FIRST_PROJECT_PLACEHOLDER
    }
  }

  switch (firstProjectData.projectType) {
    case ProjectType.DIRECT_CHAT:
    case ProjectType.GROUP_CHAT: {
      return {
        route: RouteNames.CONVERSATION,
        props: { conversationId: firstProjectData.conversationHash }
      }
    }
    case ProjectType.PROJECT: {
      return {
        route: RouteNames.PROJECT,
        props: { projectId: firstProjectData.projectId}
      }
    }
    default: {
      return {
        route: RouteNames.FIRST_PROJECT_PLACEHOLDER
      }
    }
  }
}
