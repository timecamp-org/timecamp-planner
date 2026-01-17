import React from 'react'
import ContentLoader from 'react-content-loader'
import commonColors from 'styles/colors.css'

export type BoardSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const BoardSkeletonLoader: React.FC<BoardSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={1000}
    height={420}
    viewBox="0 0 1000 420"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <rect x="3" y="6" rx="0" ry="0" width="204" height="191" />
    <rect x="3" y="300" rx="0" ry="0" width="204" height="191" />
    <rect x="3" y="208" rx="0" ry="0" width="204" height="82" />
    <rect x="227" y="6" rx="0" ry="0" width="204" height="124" />
    <rect x="227" y="229" rx="0" ry="0" width="204" height="136" />
    <rect x="227" y="138" rx="0" ry="0" width="204" height="82" />
    <rect x="449" y="98" rx="0" ry="0" width="204" height="136" />
    <rect x="449" y="7" rx="0" ry="0" width="204" height="82" />
    <rect x="669" y="7" rx="0" ry="0" width="204" height="191" />
    <rect x="669" y="301" rx="0" ry="0" width="204" height="191" />
    <rect x="669" y="209" rx="0" ry="0" width="204" height="82" />
  </ContentLoader>
)

BoardSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: commonColors.maudlinOysterColor,
  foregroundColor: commonColors.haplessSnowColor,
}

export default BoardSkeletonLoader
