import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { FileStorageModule } from './FileStorageModule';
import { FileStorageInterface } from './FileStorageInterface';
import { AmazonFileStorage } from './AmazonFileStorage';
import config from '../../../../config';
import { S3 as AmazonS3Service } from 'aws-sdk';
import { AwsS3Options, } from './types';

export const fileStorageModule: ModuleLoaderType = kernel => {
  kernel.bind<FileStorageInterface>(FileStorageModule.FileStorageInterface).to(AmazonFileStorage);
  kernel.bind(FileStorageModule.FileStorageOptions).toConstantValue(config.amazon.s3)
  kernel.bind<AmazonS3Service>(FileStorageModule.AmazonS3Service).toDynamicValue((ctx) => {
    const fileStorageOptions: AwsS3Options = ctx.container.get(FileStorageModule.FileStorageOptions);
    return new AmazonS3Service({
      endpoint: `${fileStorageOptions.scheme}://${fileStorageOptions.endpoint}`,
      region: fileStorageOptions.region,
      s3ForcePathStyle: fileStorageOptions.usePathStyleEndpoint,
      credentials: {
        accessKeyId: fileStorageOptions.accessKeyId,
        secretAccessKey: fileStorageOptions.secretAccessKey,
      },
      params: {
        Bucket: fileStorageOptions.bucket,
      },
    })
  }
  )
}
