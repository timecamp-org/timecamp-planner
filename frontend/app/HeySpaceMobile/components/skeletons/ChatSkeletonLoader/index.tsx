 
import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import {
  maudlinOysterColor,
  haplessSnowColor,
} from 'styles/colors'

export type ChatSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const ChatSkeletonLoader: React.FC<ChatSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={'100%'}
    height={'100%'}
    viewBox="0 0 430 430"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <Circle cx="20" cy="20" r="20" />
    <Rect x="60" y="5" rx="0" ry="0" width="200" height="12" />
    <Rect x="60" y="31" rx="0" ry="0" width="500" height="81" />
    <Circle cx="20" cy="153" r="20" />
    <Rect x="60" y="138" rx="0" ry="0" width="240" height="12" />
    <Rect x="60" y="164" rx="0" ry="0" width="488" height="54" />
    <Circle cx="20" cy="265" r="20" />
    <Rect x="60" y="250" rx="0" ry="0" width="200" height="12" />
    <Rect x="60" y="276" rx="0" ry="0" width="510" height="81" />
    <Circle cx="21" cy="398" r="20" />
    <Rect x="60" y="383" rx="0" ry="0" width="240" height="12" />
    <Rect x="60" y="409" rx="0" ry="0" width="461" height="21" />
  </ContentLoader>
)

ChatSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: maudlinOysterColor,
  foregroundColor: haplessSnowColor,
}

export default ChatSkeletonLoader
