import React from 'react'
import BoardSkeletonLoader from './index'
import { withKnobs, number, color } from '@storybook/addon-knobs'

const title = 'common/skeletons/BoardSkeletonLoader'

export default { title, decorators: [withKnobs] }

const animationSpeedValue = number('Animation speed', 2, {range: true, min: 1, max: 10, step: 0.1}, title)
const foregroundColorValue = color('Foreground color', '#e2e2e2', title)
const backgroundColorValue = color('Background color', '#c0c0c0', title)

export const output = () => {
  return (
    <div>
      <BoardSkeletonLoader
        animationSpeed={animationSpeedValue}
        foregroundColor={foregroundColorValue}
        backgroundColor={backgroundColorValue}
      />
    </div>
  )
}

