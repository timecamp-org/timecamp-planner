import * as Constants from './constants'
import { action } from 'typesafe-actions'
import { LinkMetadataInterface } from './types'
import { LinkMetadata } from './models'

export const onFetchLinkMetadata = (targetUrl: string) =>
  action(Constants.onFetchLinkMetadata, { targetUrl })

export const onFetchLinkMetadataSuccess = (targetUrl: string, data: LinkMetadataInterface) =>
  action(Constants.onFetchLinkMetadataSuccess, { targetUrl, data: new LinkMetadata(data) })

