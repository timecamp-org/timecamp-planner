import React, { Suspense, ReactNode, FC } from 'react'
import { View } from 'react-native'
import AppLoader from 'components/AppLoader'
import styles from './styles'

type SuspenseComponentInterface = {
  fallback: ReactNode,
  disableLoader: boolean,
}

const SuspenseComponent: FC<SuspenseComponentInterface> = ({ children, fallback, disableLoader = false }) => {
  return (
    <Suspense fallback={disableLoader ? <View style={styles.component} /> : fallback || <AppLoader isLoading />}>
      {children}
    </Suspense>
  )
}
export default SuspenseComponent
