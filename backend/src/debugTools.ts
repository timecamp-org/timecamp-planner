import { SignedUploadRequest } from './api/1.0/modules/files/types';

export namespace DebugTools {
  /**
   * Prints curl command that will upload file to upload provider as ordered
   * by SignedUploadRequest.
   *
   * @param {SignedUploadRequest} req
   */
  export function generateCurlFromSignedUploadRequest(req: SignedUploadRequest): void {
    const file = 'yarn.lock';
    const headers = Object.keys(req.headers)
      .filter(name => !!(req.headers[name]))
      .map(name => `-H '${name}: ${req.headers[name]}'`)
      .join(' ')
    ;
    const url = `${req.scheme}://${req.host}${req.path}`;
    console.log(`curl -X ${req.method} ${headers} -d '@${file}' '${url}'`)
  }
}
