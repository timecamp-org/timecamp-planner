import React, { FC } from 'react'
import { View } from 'react-native'
import { wisteriaColor } from 'common/commonStyles/colors'

import IconPlanet from 'Icons/IconPlanet'
import PlanetWithLock from 'Icons/PlanetWithLock'
import { AnyDict } from '../../../../common/types'
import { useSelector } from '../../../../common/hooks/useSelector'
import { Id } from '../../../../common/utils/identifier'
import {
  selectProjectIsPrivate,
  selectProjectColor
} from 'models/domain/ProjectsModel/selectors'

type SpaceIconInterface = {
  spaceId: Id,
  style?: AnyDict,
}

const SpaceIcon: FC<SpaceIconInterface> = (props) => {
  const isPrivate = useSelector(state => selectProjectIsPrivate(state, { projectId: props.spaceId }))
  const spaceColor = useSelector(state => selectProjectColor(state, { projectId: props.spaceId })) || wisteriaColor

  if (isPrivate) {
    return <PlanetWithLock
      style={props.style}
      color={spaceColor}
    />
  } else {
    return <IconPlanet
      style={props.style}
      color={spaceColor}
    />
  }
}

export default SpaceIcon
