import Component from './component'

import EnhanceWithCreateWorkspace from 'enhancers/EnhanceWithCreateWorkspace'
import NavigateToDefaultPageIfCurrentUserIsAuthenticated from 'enhancers/NavigateToDefaultPageIfCurrentUserIsAuthenticated'

export default NavigateToDefaultPageIfCurrentUserIsAuthenticated(
  EnhanceWithCreateWorkspace(
    Component,
  ),
)
