/**
 * Transforms pair of related rootIdsArray and nodeIdsDict into flat list of items with an extra `childrenCount`, `hasParent` and `level` properties.
 *
 * @export
 * @param {any} rootIdsArray
 * @param {any} nodeIdsDict
 */
export function flatten(rootIdsArray, nodeIdsDict) {
  validateArguments()
  return main()

  function validateArguments() {
    if (!rootIdsArray) {
      throw new Error('rootIdsArray is not defined')
    }
    if (!nodeIdsDict) {
      throw new Error('nodeIdsDict is not defined')
    }
  }

  function main() {
    const idAndLevelArrayOfObjects = []

    for (let i = 0; i < rootIdsArray.length; i++) {
      const rootId = rootIdsArray[i]
      idAndLevelArrayOfObjects.push({
        id: rootId,
        level: 0,
        hasParent: false,
      })

      traverse(rootId, nodeIdsDict, idAndLevelArrayOfObjects, 0)
    }

    for (const o of idAndLevelArrayOfObjects) {
      o.childrenCount = countChildren(o.id)
    }

    return idAndLevelArrayOfObjects

    function countChildren(id) {
      if (!nodeIdsDict[id]) {
        return 0
      }
      const childrenCount = nodeIdsDict[id].length
      return childrenCount
    }

    function traverse(startId, nodeIds, returnArray, curentLevel = 0) {
      let level = curentLevel
      if (!startId || !nodeIds || !returnArray || !nodeIds[startId]) {
        return
      }

      level++

      const idsList = nodeIds[startId]
      for (let i = 0; i < idsList.length; i++) {
        const id = idsList[i]
        returnArray.push({ id, level, hasParent: true })
        traverse(id, nodeIds, returnArray, level)
      }

      level-- // eslint-disable-line
    }
  }
}
