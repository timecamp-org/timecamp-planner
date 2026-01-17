export default function normalizeFile(file) {
  if (!file.type) {
    file.type = file.mime
  }

  if (!file.uri) {
    file.uri = file.path || file.preview
  }

  if (!file.name) {
    const fileName = file.fileName || file.filename
    if (fileName) {
      file.name = fileName
    } else {
      file.name = file.path.split('/').pop()
    }
  }

  file.name = encodeURIComponent(file.name)

  return file
}
