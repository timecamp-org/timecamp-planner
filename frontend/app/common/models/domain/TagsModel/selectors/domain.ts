import { createSelector } from 'reselect'
import { domain } from '../constants'
import { TagsState, TagsData, TagsByObjectId } from '../types';

/**
 * Direct selector to the projectsTree state domain
 */
export const selectTagsDomain = (state) => state.get(domain) as TagsState

/**
 * Other specific selectors
 */

export const selectTagsData = createSelector(
  selectTagsDomain,
  (domain) => domain.get('tagsData') as TagsData,
)

export const selectTagsByObjectId = createSelector(
  selectTagsDomain,
  (domain) => domain.get('tagsByObjectId') as TagsByObjectId,
)
