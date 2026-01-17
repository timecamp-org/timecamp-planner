import EnhanceWithUserProjectAccess from 'enhancers/EnhanceWithUserProjectAccess'
import Component from './component'
import EnhanceProjectView from './enhancers/EnhanceProjectView'
import EnhanceWithProjectReroute from './enhancers/EnhanceWithProjectReroute'

export default EnhanceProjectView(
  EnhanceWithProjectReroute(
    EnhanceWithUserProjectAccess(
      Component,
    ),
  ),
)
