import React from 'react'
import ContentLoader from 'react-content-loader'
import commonColors from 'styles/colors.css'

export type VideoSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const VideoSkeletonLoader: React.FC<VideoSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={'100%'}
    viewBox={`0 0 600 360`}
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <rect x="0" y="0" rx="0" ry="0" width="600" height="360" />
  </ContentLoader>
)

VideoSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: commonColors.maudlinOysterColor,
  foregroundColor: commonColors.haplessSnowColor,
}

export default VideoSkeletonLoader
