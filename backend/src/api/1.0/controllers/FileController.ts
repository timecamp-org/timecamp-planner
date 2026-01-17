import { Request, Response } from 'express'

import logger from '../../../infrastructure/logger'
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import { HttpStatus } from '../../../infrastructure/enum'
import { CreateFileStatus, DeleteFileStatus, SignUploadRequestStatus } from '../modules/files/types'
import { injectable, inject } from 'inversify'
import { FilesModule } from '../modules/files/FilesModule'
import { FileServiceInterface } from '../modules/files/interfaces/FileServiceInterface'

@injectable()
export class FileController {

  private fileService: FileServiceInterface

  constructor(
    @inject(FilesModule.FileServiceInterface)
      fileService: FileServiceInterface,
  ) {
    this.fileService = fileService
  }

  /**
   * Signs request so that amazon can accept a file upload
   * from another client without the client providing confidential
   * credentials (like api keys/secrets)
   */
  async signUploadRequestAction(req: Request, res: Response) {
    try {
      const result = await this.fileService.signUploadRequest(req.body);

      switch (result.status) {
        case SignUploadRequestStatus.OK:
          return res
            .status(HttpStatus.OK)
            .send(result.signedRequest)
        case SignUploadRequestStatus.FILE_UPLOAD_NOT_PERMITTED:
          return res.status(HttpStatus.FORBIDDEN).send(result.message)
        case SignUploadRequestStatus.ERROR:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async createFileAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId
      const result = await this.fileService.createFile(req.params.fileId, userId, req.body)

      switch (result.status) {
        case CreateFileStatus.OK:
          return res.status(HttpStatus.OK).send()
        case CreateFileStatus.FILE_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.FILE_ALREADY_EXISTS])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async deleteFileAction(req: Request, res: Response) {
    try {
      const result = await this.fileService.deleteFile(req.params.fileId)

      switch (result.status) {
        case DeleteFileStatus.OK:
          return res.status(HttpStatus.OK).send()
        case DeleteFileStatus.FILE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.FILE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}
