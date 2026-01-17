import React from 'react'
import ContentLoader from 'react-content-loader'
import commonColors from 'styles/colors.css'

export type ChatSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const ChatSkeletonLoader: React.FC<ChatSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={600}
    height={430}
    viewBox="0 0 600 430"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <circle cx="20" cy="20" r="20" />
    <rect x="60" y="5" rx="0" ry="0" width="200" height="12" />
    <rect x="60" y="31" rx="0" ry="0" width="500" height="81" />
    <circle cx="20" cy="153" r="20" />
    <rect x="60" y="138" rx="0" ry="0" width="240" height="12" />
    <rect x="60" y="164" rx="0" ry="0" width="488" height="54" />
    <circle cx="20" cy="265" r="20" />
    <rect x="60" y="250" rx="0" ry="0" width="200" height="12" />
    <rect x="60" y="276" rx="0" ry="0" width="510" height="81" />
    <circle cx="21" cy="398" r="20" />
    <rect x="60" y="383" rx="0" ry="0" width="240" height="12" />
    <rect x="60" y="409" rx="0" ry="0" width="461" height="21" />
    <circle cx="20" cy="554" r="20" />
  </ContentLoader>
)

ChatSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: commonColors.maudlinOysterColor,
  foregroundColor: commonColors.haplessSnowColor,
}

export default ChatSkeletonLoader
