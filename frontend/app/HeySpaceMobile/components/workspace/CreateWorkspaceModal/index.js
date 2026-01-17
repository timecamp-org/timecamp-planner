import Component from './component'

import EnhanceWithCreateWorkspace from 'enhancers/EnhanceWithCreateWorkspace'
import EnhanceCreateWorkspaceModal from './enhancers/EnhanceCreateWorkspaceModal'

export default EnhanceCreateWorkspaceModal(
  EnhanceWithCreateWorkspace(
    Component
  )
)
