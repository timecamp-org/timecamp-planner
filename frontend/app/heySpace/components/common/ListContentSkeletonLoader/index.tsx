import React from 'react'
import ContentLoader from 'react-content-loader'
import commonColors from 'styles/colors.css'

export type ListContentSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const ListContentSkeletonLoader: React.FC<ListContentSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={'100%'}
    viewBox="0 0 400 220"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <circle cx="22" cy="20" r="20" />
    <rect x="55" y="15" rx="5" ry="5" width="80%" height="15" />
    <circle cx="22" cy="80" r="20" />
    <rect x="56" y="75" rx="5" ry="5" width="80%" height="15" />
    <circle cx="22" cy="140" r="20" />
    <rect x="55" y="135" rx="5" ry="5" width="80%" height="15" />
    <circle cx="22" cy="200" r="20" />
    <rect x="56" y="196" rx="5" ry="5" width="80%" height="15" />
  </ContentLoader>
)

ListContentSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: commonColors.maudlinOysterColor,
  foregroundColor: commonColors.haplessSnowColor,
}

export default ListContentSkeletonLoader
