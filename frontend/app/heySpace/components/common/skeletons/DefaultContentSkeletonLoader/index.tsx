import React from 'react'
import ContentLoader from 'react-content-loader'
import commonColors from 'styles/colors.css'

export type DefaultContentSkeletonLoaderInterface = {
  animationSpeed?: number,
  backgroundColor?: string,
  foregroundColor?: string,
}

const DefaultContentSkeletonLoader: React.FC<DefaultContentSkeletonLoaderInterface> = (props) => (
  <ContentLoader
    speed={props.animationSpeed}
    width={'100%'}
    viewBox={`0 0 1000 420`}
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}
  >
    <rect x={'0'} y={'-8'} rx={'0'} ry={'0'} width={'221'} height={'27'} />
    <rect x={'-8'} y={'41'} rx={'0'} ry={'0'} width={'1007'} height={'1'} />
    <rect x={'896'} y={'-5'} rx={'0'} ry={'0'} width={'104'} height={'24'} />
    <rect x={'-2'} y={'55'} rx={'0'} ry={'0'} width={'103'} height={'25'} />
    <rect x={'122'} y={'55'} rx={'0'} ry={'0'} width={'99'} height={'25'} />
    <rect x={'922'} y={'55'} rx={'0'} ry={'0'} width={'82'} height={'25'} />
    <rect x={'-14'} y={'91'} rx={'0'} ry={'0'} width={'1014'} height={'1'} />
    <rect x={'3'} y={'117'} rx={'0'} ry={'0'} width={'307'} height={'48'} />
    <rect x={'144'} y={'177'} rx={'0'} ry={'0'} width={'379'} height={'48'} />
    <rect x={'434'} y={'235'} rx={'0'} ry={'0'} width={'502'} height={'48'} />
    <rect x={'67'} y={'294'} rx={'0'} ry={'0'} width={'531'} height={'48'} />
    <rect x={'253'} y={'354'} rx={'0'} ry={'0'} width={'452'} height={'48'} />
  </ContentLoader>
)

DefaultContentSkeletonLoader.defaultProps = {
  animationSpeed: 2,
  backgroundColor: commonColors.maudlinOysterColor,
  foregroundColor: commonColors.haplessSnowColor,
}

export default DefaultContentSkeletonLoader
