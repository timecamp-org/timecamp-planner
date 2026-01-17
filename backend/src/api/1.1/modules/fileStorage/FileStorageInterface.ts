import { SignedUploadRequest, UploadRequest } from "../files/types";

export interface FileStorageInterface {
  createSignedUploadRequest(
    req: UploadRequest
  ): Promise<SignedUploadRequest>

  deleteFile(fileUrl: string)

  copyFile(fileUrl: string, fileName: string): PromiseLike<string>

  generateThumbnailUrl(fileUrl: string, width: number, height: number, boundingBox: true) : PromiseLike<string>
}
