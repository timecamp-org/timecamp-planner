import RouteName from '../components/AppNavigation/routeNames';
import { NavigationService } from 'common/services'

export default function isInProjectRoute(): boolean {
  return [RouteName.PROJECT, RouteName.CONVERSATION].includes(NavigationService.getCurrentRouteName())
}