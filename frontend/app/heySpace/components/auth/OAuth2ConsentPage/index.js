import EnhancePageNotSupportedOnMobile from 'enhancers/EnhancePageNotSupportedOnMobile'
import Component from './component'
import EnhanceOAuth2ConsentPage from './enhancers/EnhanceOAuth2ConsentPage'

export default EnhancePageNotSupportedOnMobile(EnhanceOAuth2ConsentPage(Component))
