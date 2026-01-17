 
import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import {
  darkTwoColor,
  cloudyBlueColor,
} from 'styles/colors'

export type ListContentSkeletonLoaderInterface = {
  animationSpeed?: number,
  isAnimationEnabled?: boolean,
  backgroundColor?: string,
  foregroundColor?: string,
}

const ListContentSkeletonLoader: React.FC<ListContentSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    animate={props.isAnimationEnabled}
    width={'100%'}
    height={'100%'}
    viewBox="0 0 400 220"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <Circle cx="22" cy="20" r="20" /> 
    <Rect x="55" y="15" rx="5" ry="5" width="80%" height="15" /> 
    <Circle cx="22" cy="80" r="20" /> 
    <Rect x="56" y="75" rx="5" ry="5" width="80%" height="15" /> 
    <Circle cx="22" cy="140" r="20" /> 
    <Rect x="55" y="135" rx="5" ry="5" width="80%" height="15" /> 
    <Circle cx="22" cy="200" r="20" /> 
    <Rect x="56" y="196" rx="5" ry="5" width="80%" height="15" /> 
  </ContentLoader>
)

ListContentSkeletonLoader.defaultProps = {
  isAnimationEnabled: true,
  animationSpeed: 2,
  backgroundColor: darkTwoColor,
  foregroundColor: cloudyBlueColor,
}

export default ListContentSkeletonLoader