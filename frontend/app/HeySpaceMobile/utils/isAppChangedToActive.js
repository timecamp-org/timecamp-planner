import appStates from './appStates'

const regex = new RegExp(`${appStates.INACTIVE}|${appStates.BACKGROUND}`, 'g')

export default (prevAppState, nextAppState) =>
  prevAppState.match(regex) && nextAppState === appStates.ACTIVE
