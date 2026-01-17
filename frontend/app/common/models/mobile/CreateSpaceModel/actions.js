import * as constants from './constants'

export function onChangeSpaceName(spaceName) {
  return {
    type: constants.onChangeSpaceName,
    spaceName,
  }
}

export function onChangeSpacePurpose(spacePurpose) {
  return {
    type: constants.onChangeSpacePurpose,
    spacePurpose,
  }
}

export function onAddSpaceMember(userId) {
  return {
    type: constants.onAddSpaceMember,
    userId,
  }
}

export function onRemoveSpaceMember(userId) {
  return {
    type: constants.onRemoveSpaceMember,
    userId,
  }
}

export function onChangeSpaceColor(spaceColor) {
  return {
    type: constants.onChangeSpaceColor,
    spaceColor,
  }
}

export function onChangeSpaceIsPrivate(isPrivate) {
  return {
    type: constants.onChangeSpaceIsPrivate,
    isPrivate,
  }
}

export function onChangeIsCurrentUserFollowingSpace(isFollowing) {
  return {
    type: constants.onChangeIsCurrentUserFollowingSpace,
    isFollowing,
  }
}

export function onResetCreateSpaceData() {
  return {
    type: constants.onResetCreateSpaceData,
  }
}







