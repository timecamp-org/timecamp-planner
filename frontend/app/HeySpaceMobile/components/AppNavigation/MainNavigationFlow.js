import React, { lazy } from 'react';
import styles from './styles';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import RouteName from './routeNames';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// misc
import MenuBurgerIcon from '../menu/MenuBurgerIcon';
import LeftMenu from '../menu/LeftMenu';
import NotificationsCenterIcon from '../notifications/NotificationsCenterIcon';
import SupportScreen from '../common/SupportScreen';
import ProjectPageTitle from '../projects/ProjectPageTitle';
import NotificationsCenterScene from '../notifications/NotificationsCenterScene';
import ConvertMessageToCard from '../chat/ConvertMessageToCard';
import WorkspaceManagement from '../workspace/WorkspaceManagement';
// project
import FirstProjectPlaceholderView from '../projects/FirstProjectPlaceholderView';
import ProjectView from '../projects/ProjectView';
import SpaceSettings from '../projects/SpaceSettings';
import ProjectMembers from '../projects/ProjectMembers';
import AddProjectMembers from '../projects/AddProjectMembers';
import CreateSpace from '../projects/ManageSpace/createSpace';
import CreateSpaceColorScreen from '../projects/ManageSpaceColorScreen/createSpace';
import CreateSpacePrivacyScreen from '../projects/ManageSpacePrivacyScreen/createSpace';
import CreateSpaceMembers from '../settings/IOSMembers/createSpace';
import CreateSpaceAddMemberScreen from '../projects/AddMembersScreen/createSpace';
// manage project
import ManageSpace from '../projects/ManageSpace';
import ManageSpaceColorScreen from '../projects/ManageSpaceColorScreen/manageSpace';
import ManageSpacePrivacyScreen from '../projects/ManageSpacePrivacyScreen/manageSpace';
import ManageSpaceMembers from '../settings/IOSMembers/manageSpace';
import ManageSpaceAddMemberScreen from '../projects/AddMembersScreen/manageSpace';
import ManageSpaceChatNotifications from '../projects/ManageSpaceChatNotifications';

// task
import CardDetails from '../kanban/CardDetails';
import TaskAssignees from '../settings/IOSMembers/taskAssignees';
import TaskAssigneesAddMemberScreen from '../projects/AddMembersScreen/taskAssignees';
import NavigateToAddCardAssigneesButton from '../settings/IOSSettingsNavButton/navigateToAddCardAssignees';
import CardDescriptionEditor from '../kanban/CardDescriptionEditor';

// settings
import UserSettingsNavigation from '../settings/userSettings/UserSettingsNavigation';
import GeneralSettings from '../settings/GeneralSettings';
import ProfileScene from '../settings/userSettings/ProfileScene';
import IOSProfileScreen from '../settings/IOSProfileScreen';
import NotificationSettings from '../settings/userSettings/NotificationSettings';
import WorkspaceMembers from '../settings/WorkspaceMembers';
import TeamMembersManagement from '../settings/TeamMembersManagement';
import ChangePasswordScreen from '../settings/ChangePasswordScreen';
import InviteToWorkspaceScreen from '../workspace/InviteToWorkspaceScreen';

// nav buttons
import CreateSpaceButton from '../settings/IOSSettingsNavButton/createSpace';
import NavigateToInviteToCreateSpaceAddMemberButton from '../settings/IOSSettingsNavButton/navigateToCreateSpaceAddMember';
import SaveProfileSettingsButton from '../settings/IOSSettingsNavButton/saveProfileSettings';
import NavigateToInviteToWorkspaceButton from '../settings/IOSSettingsNavButton/navigateToInviteToWorkspace';
import ChangePasswordButton from '../settings/IOSSettingsNavButton/changePassword';
import InviteUserButton from '../settings/IOSSettingsNavButton/inviteUser';
import NavigateToManageSpaceButton from '../settings/IOSSettingsNavButton/navigateToManageSpace';
import NavigateToInviteToManageSpaceAddMemberButton from '../settings/IOSSettingsNavButton/navigateToManageSpaceAddMember';
import OpenCardMoreOptionsButton from '../settings/IOSSettingsNavButton/openCardMoreOptionsButton';
import ProjectLoader from '../projects/ProjectLoader';

import isIOS from '../../utils/isIOS';
import { blackColor, whiteTwoColor } from '../../../common/commonStyles/colors';

const backButtonTintColor = isIOS ? blackColor : whiteTwoColor;
const renderAppLoader = () => <ProjectLoader />;
const MainFlowStack = createStackNavigator(
  {
    // projects
    [RouteName.PROJECT_LOADER]: {
      screen: renderAppLoader,
      navigationOptions: {
        headerStyle: {
          display: 'none',
        },
      },
    },
    [RouteName.FIRST_PROJECT_PLACEHOLDER]: {
      screen: FirstProjectPlaceholderView,
      navigationOptions: {
        title: 'Create a new project',
        headerTintColor: backButtonTintColor,
        headerLeft: <MenuBurgerIcon />,
      },
    },

    [RouteName.PROJECT]: {
      screen: ProjectView,
      navigationOptions: (navigationProps) => ({
        headerTintColor: backButtonTintColor,
        headerTitle: () => <ProjectPageTitle {...navigationProps} />,
        headerRight: isIOS ? (
          <NavigateToManageSpaceButton projectId={navigationProps.navigation.state.params.projectId} />
        ) : (
          <NotificationsCenterIcon />
        ),
        headerLeft: <MenuBurgerIcon />,
      }),
    },

    [RouteName.CONVERSATION]: {
      screen: ProjectView,
      navigationOptions: (navigationProps) => ({
        headerTintColor: backButtonTintColor,
        headerTitle: () => <ProjectPageTitle {...navigationProps} />,
        headerRight: <NotificationsCenterIcon />,
        headerLeft: <MenuBurgerIcon />,
      }),
    },

    [RouteName.PROJECT_SETTINGS]: {
      screen: SpaceSettings,
      navigationOptions: {
        headerTintColor: backButtonTintColor,
        title: 'Settings',
      },
    },

    [RouteName.PROJECT_MEMBERS]: {
      screen: ProjectMembers,
      navigationOptions: {
        headerTintColor: backButtonTintColor,
        title: 'Members',
      },
    },

    [RouteName.PROJECT_MEMBERS_ADD]: {
      screen: AddProjectMembers,
      navigationOptions: {
        headerTintColor: backButtonTintColor,
        title: 'Add members to project',
      },
    },

    // create space
    [RouteName.CREATE_SPACE]: {
      screen: CreateSpace,
      navigationOptions: {
        title: 'Create new project',
        headerTintColor: backButtonTintColor,
        headerRight: <CreateSpaceButton />,
      },
    },
    [RouteName.CREATE_SPACE_MEMBERS]: {
      screen: CreateSpaceMembers,
      navigationOptions: {
        title: 'Project members',
        headerTintColor: backButtonTintColor,
        headerRight: <NavigateToInviteToCreateSpaceAddMemberButton />,
      },
    },
    [RouteName.CREATE_SPACE_MEMBER_ADD]: {
      screen: CreateSpaceAddMemberScreen,
      navigationOptions: {
        title: 'Add member',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.CREATE_SPACE_COLOR]: {
      screen: CreateSpaceColorScreen,
      navigationOptions: {
        title: 'Project color',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.CREATE_SPACE_PRIVACY]: {
      screen: CreateSpacePrivacyScreen,
      navigationOptions: {
        title: 'Project privacy',
        headerTintColor: backButtonTintColor,
      },
    },

    // manage space
    [RouteName.MANAGE_SPACE]: {
      screen: ManageSpace,
      navigationOptions: {
        title: 'Manage project',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.MANAGE_SPACE_MEMBERS]: {
      screen: ManageSpaceMembers,
      navigationOptions: (navigationProps) => ({
        title: 'Project members',
        headerTintColor: backButtonTintColor,
        headerRight: (
          <NavigateToInviteToManageSpaceAddMemberButton projectId={navigationProps.navigation.state.params.projectId} />
        ),
      }),
    },
    [RouteName.MANAGE_SPACE_MEMBER_ADD]: {
      screen: ManageSpaceAddMemberScreen,
      navigationOptions: {
        title: 'Add member',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.MANAGE_SPACE_COLOR]: {
      screen: ManageSpaceColorScreen,
      navigationOptions: {
        title: 'Project color',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.MANAGE_SPACE_PRIVACY]: {
      screen: ManageSpacePrivacyScreen,
      navigationOptions: {
        title: 'Project privacy',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.MANAGE_SPACE_CHAT_NOTIFICATIONS]: {
      screen: ManageSpaceChatNotifications,
      navigationOptions: {
        title: 'Project chat notifications',
        headerTintColor: backButtonTintColor,
      },
    },

    // tasks
    [RouteName.CARD_DETAILS]: {
      screen: CardDetails,
      navigationOptions: (navigationProps) => ({
        headerTintColor: backButtonTintColor,
        headerTitle: () => <ProjectPageTitle {...navigationProps} />,
        headerRight: isIOS ? (
          <OpenCardMoreOptionsButton projectId={navigationProps.navigation.state.params.projectId} />
        ) : (
          <NotificationsCenterIcon />
        ),
      }),
    },
    [RouteName.MANAGE_CARD_ASSIGNEES]: {
      screen: TaskAssignees,
      navigationOptions: (navigationProps) => ({
        headerTintColor: backButtonTintColor,
        title: 'Task assignees',
        headerRight: <NavigateToAddCardAssigneesButton taskId={navigationProps.navigation.state.params.taskId} />,
      }),
    },
    [RouteName.MANAGE_CARD_ASSIGNEES_ADD]: {
      screen: TaskAssigneesAddMemberScreen,
      navigationOptions: {
        headerTintColor: backButtonTintColor,
        title: 'Assign users',
      },
    },
    [RouteName.CARD_DESCRIPTION]: {
      screen: CardDescriptionEditor,
      navigationOptions: {
        headerTintColor: backButtonTintColor,
        title: 'Description',
        headerRight: isIOS ? null : <NotificationsCenterIcon />,
      },
    },

    // settings
    [RouteName.USER_SETTINGS_NAVIGATION]: {
      screen: isIOS ? GeneralSettings : UserSettingsNavigation,
      navigationOptions: {
        title: 'Account settings',
        headerTintColor: backButtonTintColor,
      },
    },
    [RouteName.PROFILE]: {
      screen: isIOS ? IOSProfileScreen : ProfileScene,
      navigationOptions: {
        title: 'Your profile',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? <SaveProfileSettingsButton /> : <NotificationsCenterIcon />,
      },
    },
    [RouteName.NOTIFICATION_SETTINGS]: {
      screen: NotificationSettings,
      navigationOptions: {
        title: 'Notifications settings',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? null : <NotificationsCenterIcon />,
      },
    },
    [RouteName.TEAM_MANAGEMENT]: {
      screen: isIOS ? WorkspaceMembers : TeamMembersManagement,
      navigationOptions: {
        title: 'Team members',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? <NavigateToInviteToWorkspaceButton /> : null,
      },
    },
    [RouteName.INVITE_TO_WORKSPACE]: {
      screen: isIOS ? InviteToWorkspaceScreen : TeamMembersManagement,
      navigationOptions: {
        title: 'Invite',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? <InviteUserButton /> : null,
      },
    },
    [RouteName.CHANGE_PASSWORD]: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        title: 'Change password',
        headerTintColor: backButtonTintColor,
        headerRight: <ChangePasswordButton />,
      },
    },
    [RouteName.SUPPORT]: {
      screen: SupportScreen,
      navigationOptions: {
        title: 'Support',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? null : <NotificationsCenterIcon />,
      },
    },

    // notifications
    [RouteName.NOTIFICATIONS_CENTER]: {
      screen: NotificationsCenterScene,
      navigationOptions: {
        title: 'Notifications',
        headerTintColor: backButtonTintColor,
      },
    },

    [RouteName.CONVERT_MESSAGE_TO_CARD]: {
      screen: ConvertMessageToCard,
      navigationOptions: {
        title: 'Convert message to task',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? null : <NotificationsCenterIcon />,
      },
    },

    [RouteName.WORKSPACE_MANAGEMENT]: {
      screen: WorkspaceManagement,
      navigationOptions: {
        title: 'Create or switch workspace',
        headerTintColor: backButtonTintColor,
        headerRight: isIOS ? null : <NotificationsCenterIcon />,
      },
    },
  },
  {
    initialRouteName: RouteName.PROJECT_LOADER,
    defaultNavigationOptions: {
      headerBackTitleVisible: false,
      headerStyle: styles.defaultNavHeader,
      headerTitleStyle: styles.defaultNavHeaderTitle,
      animationEnabled: false,
      cardStyle: {
        backgroundColor: whiteTwoColor,
      },
    },
  }
);

const MainNavigationFlow = createDrawerNavigator(
  {
    [RouteName.MAIN_FLOW_STACK]: MainFlowStack,
  },
  {
    contentComponent: LeftMenu,
    initialRouteName: RouteName.MAIN_FLOW_STACK,
    drawerWidth: wp('85%'),
    navigationOptions: {
      animationEnabled: false,
    },
  }
);

export default MainNavigationFlow;
