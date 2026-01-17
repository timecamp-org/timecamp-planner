import { createSelector } from 'reselect'
import * as Constants from './constants'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../utils/generateSelectorName'
import { LinkPreviewData } from './types'
import { LinkMetadata } from './models'

export const selectLinkPreviewDomain = (state) => state.get(Constants.domain)

export const selectLinkPreviewDataDomain = createSelector(
  selectLinkPreviewDomain,
  (domain) => domain.get('linkPreviewData') as LinkPreviewData,
)

// targetUrl
export const selectLinkPreviewData = createCachedSelector(
  selectLinkPreviewDataDomain,
  (_, args) => args.targetUrl,
  (linkPreviewData, targetUrl) => linkPreviewData.get(targetUrl) as LinkMetadata,
)
  (
    (_, args) => generateSelectorName(args, ['targetUrl']),
  )


// targetUrl, property
export const selectLinkPreviewProperty = createCachedSelector(
  selectLinkPreviewData,
  (_, args) => args.property,
  (linkPreviewData, property) => (linkPreviewData ? linkPreviewData.get(property) : null),
)
  (
    (_, args) => generateSelectorName(args, ['targetUrl', 'property']),
  )
