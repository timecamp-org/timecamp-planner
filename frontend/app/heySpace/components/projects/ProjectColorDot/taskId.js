import component from './component'

import EnhanceWithTaskProjectId from 'enhancers/EnhanceWithTaskProjectId'
import EnhanceWithProjectColor from 'enhancers/EnhanceWithProjectColor'

export default EnhanceWithTaskProjectId(EnhanceWithProjectColor(component))
