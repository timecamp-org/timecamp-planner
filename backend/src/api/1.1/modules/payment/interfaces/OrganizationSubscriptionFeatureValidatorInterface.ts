import { Id } from '../../common/identifier'
import { CheckFileIsAllowedToUploadResult } from '../types'

export interface OrganizationSubscriptionFeatureValidatorInterface {
  checkFileIsAllowedToUpload(organizationId: Id, fileSize: number): Promise<CheckFileIsAllowedToUploadResult>
}