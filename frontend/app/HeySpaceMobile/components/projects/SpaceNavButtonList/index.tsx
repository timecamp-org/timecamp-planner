import React, { useCallback, memo } from 'react'
import styles from './styles'
import navMenuStyles from '../../../styles/navMenu'
import { View } from 'react-native'
import SpaceNavButton from '../../projects/SpaceNavButton'
import useComponent from './hook'
import ListContentSkeletonLoader from 'components/skeletons/ListContentSkeletonLoader'
import {
  darkTwoColor,
  duskColor,
} from 'styles/colors'

const SpaceNavButtonList = () => {
  const { spaceList, isSelected, isLoading } = useComponent()

  const renderSpaceNavButton = useCallback((spaceId) => {
    return (
      <SpaceNavButton
        key={spaceId}
        spaceId={spaceId}
        isSelected={isSelected(spaceId)}
      />
    )
  }, [isSelected])

  if (isLoading) {
    return renderSkeleton()
  }

  return (

    <View style={styles.container}>
      {
        spaceList.map(renderSpaceNavButton)
      }
    </View>
  )
}

function renderSkeleton() {
  return (
    <View style={navMenuStyles.skeletonWrapper}>
      <ListContentSkeletonLoader
        backgroundColor={darkTwoColor}
        foregroundColor={duskColor}
      />
    </View>
  )
}

export default memo(SpaceNavButtonList)