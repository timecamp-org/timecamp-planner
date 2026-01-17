import { OrganizationSubscriptionFeatureValidatorInterface } from './interfaces/OrganizationSubscriptionFeatureValidatorInterface'
import { inject, injectable } from 'inversify'
import { PaymentModule } from './PaymentModule'
import { SubscriptionFeatureProviderInterface } from './interfaces/SubscriptionFeatureProviderInterface'
import { Id } from '../common/identifier'
import { FilesModule } from '../files/FilesModule'
import {
  CheckFileIsPermittedToUploadMessage,
  CheckFileIsAllowedToUploadResult,
  FeatureCode,
  SubscriptionFeature,
} from './types'
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface'

@injectable()
export class OrganizationSubscriptionFeatureValidator implements OrganizationSubscriptionFeatureValidatorInterface {

  private subscriptionFeatureProvider
  private fileProvider

  constructor(
    @inject(PaymentModule.SubscriptionFeatureProviderInterface) subscriptionFeatureProvider: SubscriptionFeatureProviderInterface,
    @inject(FilesModule.FileProviderInterface) fileProvider: FileProviderInterface,
  ) {
    this.subscriptionFeatureProvider = subscriptionFeatureProvider
    this.fileProvider = fileProvider
  }

  async checkFileIsAllowedToUpload(organizationId: Id, fileSize: number): Promise<CheckFileIsAllowedToUploadResult> {
    const organizationTotalFilesSize = await this.fileProvider.getOrganizationTotalFilesSize(organizationId)

    const checkForOrganizationTotalFilesSizeLimitPromise = this.subscriptionFeatureProvider.checkForOrganizationSubscriptionFeature(
      organizationId,
      FeatureCode.ORGANIZATION_TOTAL_FILES_SIZE,
      (subscriptionFeature: SubscriptionFeature) => {
        if (!subscriptionFeature.isAllowed) {
          return {
            isAllowed: false,
            message: 'Your subscription does not allow uploading files'
          }
        } else if (subscriptionFeature.isUnlimited) {
          return {
            isAllowed: true,
          }
        } else {
          const isAllowed = subscriptionFeature.value >= organizationTotalFilesSize + fileSize
          return {
            isAllowed,
            message: isAllowed ? undefined : CheckFileIsPermittedToUploadMessage.FILE_STORAGE_QUOTA_EXCEEDED
          }
        }
      }

    )

    const checkForOrganizationSingleFileUploadLimitPromise = this.subscriptionFeatureProvider.checkForOrganizationSubscriptionFeature(
      organizationId, FeatureCode.ORGANIZATION_SINGLE_FILE_SIZE,
      (subscriptionFeature: SubscriptionFeature) => {
        if (!subscriptionFeature.isAllowed) {
          return {
            isAllowed: false,
            message: 'Your subscription does not allow uploading file'
          }
        } else if (subscriptionFeature.isUnlimited) {
          return {
            isAllowed: true,
          }
        } else {
          const isAllowed = subscriptionFeature.value >= fileSize
          return {
            isAllowed,
            message: isAllowed ? undefined : CheckFileIsPermittedToUploadMessage.SINGLE_FILE_SIZE_EXCEEDED
          }
        }
      }
    )

    const [checkForOrganizationTotalFilesSizeLimit, checkForOrganizationSingleFileUploadLimit] =
      await Promise.all([
        checkForOrganizationTotalFilesSizeLimitPromise,
        checkForOrganizationSingleFileUploadLimitPromise,
      ])

    return {
      isAllowed: checkForOrganizationTotalFilesSizeLimit.isAllowed && checkForOrganizationSingleFileUploadLimit.isAllowed,
      message: checkForOrganizationTotalFilesSizeLimit.message || checkForOrganizationSingleFileUploadLimit.message
    }
  }
}
