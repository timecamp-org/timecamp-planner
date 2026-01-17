import { HttpMethod, HttpScheme } from '../../../../infrastructure/enum'
import { createHash } from 'crypto'
import { generateId } from '../common/identifier'

import { config as awsConfig, Endpoint, HttpRequest } from 'aws-sdk';
import * as AmazonV4Signature from 'aws-sdk/lib/signers/v4';
import { FileStorageInterface } from './FileStorageInterface';
import { UploadRequest, SignedUploadRequest } from '../files/types';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { AwsS3Options, AmzHeader, StandardHeaders, SERVICE_S3, AMAZON_UPLOAD_PROVIDER, UNSIGNED_PAYLOAD, HASH_ALG } from './types';
import { injectable, inject } from 'inversify';
import { CommonModule } from '../common/CommonModule';
import { FileStorageModule } from './FileStorageModule';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger'
import { getAmazonIdFromUrl, getResizedImageAmazonId } from './utils';

@injectable()
export class AmazonFileStorage implements FileStorageInterface {

  private endpoint: string;
  private bucket: string;
  private region: string;
  private acceptableResizeSizes: number[];
  private timeService: TimeServiceInterface;
  private expiryTime: string;
  private amazonS3Service: AWS.S3;
  private logger: LoggerInterface;
  private scheme: 'http' | 'https';
  private usePathStyleEndpoint: boolean;

  constructor(
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
    @inject(FileStorageModule.FileStorageOptions) opts: AwsS3Options,
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(FileStorageModule.AmazonS3Service) amazonS3Service,
  ) {
    awsConfig.update({
      accessKeyId: opts.accessKeyId,
      secretAccessKey: opts.secretAccessKey,
      region: opts.region,
    });
    this.endpoint = opts.endpoint;
    this.bucket = opts.bucket;
    this.region = opts.region;
    this.acceptableResizeSizes = opts.acceptableResizeSizes;
    this.timeService = timeService;
    // Headers accept string type, co we convert num -> str
    this.expiryTime = `${opts.requestExpiryTime}`;
    this.logger = logger
    this.amazonS3Service = amazonS3Service
    this.scheme = opts.scheme;
    this.usePathStyleEndpoint = opts.usePathStyleEndpoint;
  }

  public async createSignedUploadRequest(
    req: UploadRequest
  ): Promise<SignedUploadRequest> {
    const objectKey: string = AmazonFileStorage.generateObjectKey(req.name);
    const now = this.timeService.getCurrentTime();
    const host = this.getStorageHost();
    const path = this.getStoragePath(objectKey);
    const httpRequest = new HttpRequest(
      new Endpoint(`${this.scheme}://${host}${path}`),
      this.region
    );
    httpRequest.method = HttpMethod.PUT.toUpperCase();
    if (req.hash) {
      httpRequest.headers[AmzHeader.SHA256] = req.hash[HASH_ALG];
    } else {
      httpRequest.headers[AmzHeader.SHA256] = UNSIGNED_PAYLOAD;
    }
    httpRequest.headers[AmzHeader.EXPIRES] = this.expiryTime;

    httpRequest.headers[StandardHeaders.HOST] = host;
    httpRequest.headers[StandardHeaders.CONTENT_DISPOSITION] = `inline; filename=${req.name}`;
    const signer = new AmazonV4Signature(
      httpRequest,
      SERVICE_S3,
    );

    signer.addAuthorization(awsConfig.credentials, now);

    return {
      provider: AMAZON_UPLOAD_PROVIDER,

      scheme: this.scheme === 'https' ? HttpScheme.HTTPS : HttpScheme.HTTP,
      host: httpRequest.endpoint.hostname,
      method: httpRequest.method,
      path,
      headers: httpRequest.headers,

      targetUri: this.generateObjectUri(objectKey),
      name: req.name,
      mimeType: req.contentType
    };
  }

  private getStorageHost() {
    if (this.usePathStyleEndpoint) {
      return this.endpoint;
    }
    return `${this.bucket}.${this.endpoint}`;
  }

  private getStoragePath(objectKey: string) {
    return this.usePathStyleEndpoint ? `/${this.bucket}/${objectKey}` : `/${objectKey}`;
  }

  public async deleteFile(fileUrl: string) {
    const fileAmazonId = getAmazonIdFromUrl(fileUrl)
    this.deleteFromAmazon(fileAmazonId)

    // remove resized versions
    this.acceptableResizeSizes.forEach(size => {
      const resizedImageAmazonId = getResizedImageAmazonId(fileAmazonId, size)
      this.deleteFromAmazon(resizedImageAmazonId)
    })
  }

  public async copyFile(fileUrl: string, fileName: string): Promise<string> {
    const fileAmazonId = getAmazonIdFromUrl(fileUrl)
    const objectKey = AmazonFileStorage.generateObjectKey(fileName)

    this.copyAmazonFile(fileAmazonId, objectKey)

    return this.generateObjectUri(objectKey)
  }

  async generateThumbnailUrl(fileUrl: string, width: number, height: number, boundingBox: true): Promise<string> {
    const fileAmazonId = getAmazonIdFromUrl(fileUrl);
    if (this.acceptableResizeSizes.indexOf(width) < 0 || this.acceptableResizeSizes.indexOf(height) < 0) {
      throw new Error(`Not acceptable thumb size: ${width}x${height}`);
    }
    if (!boundingBox) {
      throw new Error('Non box bound thumbnails not supported');
    }

    return this.generateObjectUri(getResizedImageAmazonId(fileAmazonId, width));
  }

  private deleteFromAmazon(amazonId: string) {
    this.amazonS3Service.deleteObject({
      Bucket: this.bucket,
      Key: amazonId,
    }, (error) => {
      if (error) {
        this.logger.error(error)
      }
    })
  }

  private copyAmazonFile(sourceAmazonId: string, destAmazonId: string) {
    this.amazonS3Service.copyObject({
      Bucket: this.bucket,
      Key: destAmazonId,
      CopySource: this.generateCopySource(sourceAmazonId)
    }, (error) => {
      if (error) {
        this.logger.error(error)
      }
    })
  }

  private static generateObjectKey(name: string): string {
    return createHash(HASH_ALG)
      .update(`${name} ${generateId()}`)
      .digest('hex')
    ;
  }

  private generateObjectUri(objectKey: string) {
    const host = this.getStorageHost();
    const path = this.getStoragePath(objectKey);
    return `${this.scheme}://${host}${path}`;
  }

  private generateCopySource(objectKey: string) {
    return `/${this.bucket}/${objectKey}`
  }
}
