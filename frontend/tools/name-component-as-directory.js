module.exports = function (source) {
  const parentFolderName = this.context.slice(this.context.lastIndexOf('/') + 1, this.context.length)
  const phraseToInject = `Component.displayName = \'${parentFolderName}\'\nexport default Component`

  return source.replace('export default Component', phraseToInject)
}
