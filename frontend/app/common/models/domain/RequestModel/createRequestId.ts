import { ProjectType } from '../ProjectsModel/types'
import { generateConversationId } from '../../../utils/generateCombinedId'
import { Id } from '../../../utils/identifier';
import { List } from 'immutable';

/**
 * @param {string} requestType
 * @param {string | array} params
 * @return {string}
 */
export default (requestType: string, params: string | string[]): string => {
  let result = requestType
  let queryString = ''
  if (requestType.includes('?')) {
    const [baseRequestType, extractedQueryString] = requestType.split('?')
    result = baseRequestType
    queryString = extractedQueryString
  }

  if (typeof params === 'string') {
    result = `${result}::${params}`
  } else if (Array.isArray(params)) {
    for (let i = 0; i < params.length; i++) {
      result = `${result}::${params[i]}`
    }
  }

  return `${result}${queryString ? `?${queryString}` : ''}`
}

/**
 * @param {string} currentUserId
 * @param {string} projectId
 * @param {string} projectType
 * @param {List} people
 */
export const generateCreateProjectRequestId = (
  currentUserId: Id,
  projectId: Id,
  projectType: ProjectType,
  people: List<Id>,
  organizationId: Id
): string => {
  let result = ''

  switch (projectType) {
    case ProjectType.DIRECT_CHAT: {
      const userId = people.filter(id => id !== currentUserId).first()
      result = `${projectType}::${userId}::${organizationId}`
      break
    }
    case ProjectType.GROUP_CHAT: {
      result = `${projectType}::${generateConversationId(people, organizationId)}`
      break
    }
    default: {
      result = `${projectId}`
    }
  }

  return result
}
