export const AMAZON_UPLOAD_PROVIDER = 'aws';

export enum AmzHeader {
  EXPIRES = 'X-Amz-Expires',
  SHA256 = 'X-Amz-Content-Sha256'
}

export enum StandardHeaders {
  HOST = 'Host',
  CONTENT_DISPOSITION = 'Content-Disposition',
}

export const UNSIGNED_PAYLOAD = 'UNSIGNED-PAYLOAD';
export const HASH_ALG = 'sha256';
export const SERVICE_S3 = 's3';

export interface AwsS3Options
{
  endpoint: string,
  region: string,
  bucket: string,
  requestExpiryTime: number,
  acceptableResizeSizes: number[],
  accessKeyId: string,
  secretAccessKey: string,
  scheme: 'http' | 'https',
  // Address that web browsers use for uploads and file links. It differs from
  // endpoint when the backend reaches storage on an internal network (Docker).
  publicEndpoint?: string,
  publicScheme?: 'http' | 'https',
  usePathStyleEndpoint: boolean,
}
