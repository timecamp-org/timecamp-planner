import { buffers, eventChannel, END } from 'redux-saga'
import sanitizeString from './sanitizeString'

const guardedHeaders = [
  'Host',
  'User-Agent',
]

// targetUri keeps the scheme and port of the storage (for example
// http://localhost:9000 for a self-hosted MinIO).
function getObjectUrl(authorizationResponse) {
  return authorizationResponse.targetUri || `https://${authorizationResponse.host}${authorizationResponse.path}`
}

function FileUpload(timecampClient) {
  function createUploadFileChannel(file, organizationId) {
    return eventChannel(emitter => {
      const sanitizedFileName = sanitizeString(file.name)
      timecampClient.restApiClient.authorizeFileUpload(sanitizedFileName, file.size, organizationId, (authorizationError, authorizationResponse) => {
        if (authorizationError) {
          onFailure(authorizationError, emitter)
        } else {
          try {
            var request = new XMLHttpRequest()

            request.upload.onprogress = (event) => onProgress(event, emitter)
            request.upload.onabort = (event) => onFailure(event, emitter)
            request.upload.onerror = (event) => onFailure(event, emitter)
            request.onreadystatechange = (event) => onUploadReadyStateChange(event, request, authorizationResponse, emitter)

            request.open('PUT', getObjectUrl(authorizationResponse), true)
            const { headers } = authorizationResponse

            // these headers can only be set by the browser due to security reasons
            guardedHeaders.forEach(headerName => {
              delete headers[headerName]
            })
            request.setRequestHeader('Content-Type', file.type)
            Object.keys(headers).forEach(headerName => request.setRequestHeader(headerName, headers[headerName]))

            request.send(file)
          } catch (error) {
            onFailure(error, emitter)
          }
        }
      })
      return () => { }
    }, buffers.sliding(2))
  }

  function onFailure(error, emitter) {
    emitter({ error })
    emitter(END)
  }

  function onProgress(event, emitter) {
    if (event.lengthComputable) {
      var percentComplete = ((event.loaded / event.total) * 100)
      emitter({ progress: percentComplete })
    }
  }

  function onUploadReadyStateChange(event, request, authorizationResponse, emitter) {
    if (request.readyState === 4) {
      if (request.status !== 200) {
        emitter({ error: { request, event } })
        emitter(END)
      } else {
        emitter({ url: getObjectUrl(authorizationResponse) })
        emitter(END)
      }
    }
  }

  return {
    createUploadFileChannel,
  }
}

export default FileUpload
