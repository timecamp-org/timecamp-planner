import component from './component'

import EnhanceAddUsersToProjectModal from './enhancers/EnhanceAddUsersToProjectModal'
import EnhanceWithProjectColor from 'enhancers/EnhanceWithProjectColor'

export default EnhanceWithProjectColor(EnhanceAddUsersToProjectModal(component))
