# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Kanban cards limit extension

## [2.60.0] - 2021-11-30

### Added

- Task list to 1on1 conversations
- Timeline to 1on1 conversations
- Make "x days of trial left" linked to subscription page
- Added isEmbedded flag for better displaying as iframe content

### Changed

- Migrated to React 17

### Fixed

- Fixed email change validation
- Removed Escape Rule from Markdown parsers
- QuickSwitcher modal performance improvements

### Refactored

- CurrentUserModel
- HumanMessageModel
- ControlCommandModel

## [2.55.0] - 2021-06-08

### Added

- Auto-hiding conversations in Team section

### Updated

- calendly link

### Fixed

- Fixed special languages characters in markdown strong renderer

## [2.54.0] - 2021-03-09

### Added

- Toggle disabled checkbox in team popup
- TeamHeaderMenu to ts + hooks, some typings changed
- Previous organizations count to "workspaceCreated" event props

### Fixed

- Project description refactored to TS + hooks, fixed bug with dispatching on every sign change
- Don't reset team member input fixed
- Disappearing tasks while changing views or filters
- Disable toggle follow button for user assigned to task in desktop app
- Fixed small images size on chat
- Fixed blurred images on chat on some browsers
- Fixed error with enlarging images on chat
- Fixed app-crashing markdown strong regex
- Fixed calendar popup out the screen
- Fixed losing messages after feed reconnect

### Updated

- npm packages

## [2.53.0] - 2020-11-23

### Fixed

- Jitsi desktop app screen sharing
- changed app download link in menu
- Fix 500 with null project color
- duplicated tasks in list after reconnect edge case
- blocked possibility of change workspace ownership to deleted user
- disabled changing role of deleted user
- disappearing changes from task status made in 4s frames
- calendar end date picker
- date range picker clearing time issue

## [2.52.0] - 2020-09-21

### Added

- sorted tags in filters
- self hosted jitsi to TC only
- more emojis

### Fixed

- batching unwanted actions
- bloating localStorage
- searching completed tasks in archived filter

## [2.51.0] - 2020-09-18

### Fixed

- jumping cursor in projectName input
- filtering myTasks timeline and styles
- Emoji match

### Added

- AddCardButton to SpaceTimelineView
- Masked DateInput

## [2.50.0] - 2020-09-15

### Fixed

- BasicGoogleProfile parsing
- ViewSettings overlapping container

### Added

- calendar and timeline to MyTasks
- Persistable MyTasks filters

## [2.49.0] - 2020-09-14

### Fixed

- 'forEach' of null error
- more unreads badge isibility on org change
- NavigationPrompt when prop

### Added

- draggable minimized UniversalModal
- deboucne to setting card description dirty
- tracking onboarding task lists
- Workspace created event

## [2.48.0] - 2020-09-07

### Added

- Jitsi meets

### Fixed

- Navigation arrows cards behavior
- Clicking link in card description

## [2.47.0] - 2020-09-04

### Changed

- WorkspacesPanel visible by default

### Fixed

- Listeners leak
- Badge styles
- Double open attachments

### Added

- Arrow navigation
- CSP header for upgrading unsecure requests

## [2.46.0] - 2020-08-31

### Changed

- Bumped packages

### Added

- Virtualization in kanban
- sorting task attachments

### Fixed

- bugs after adding doctype html

## [2.45.0] - 2020-08-27

### Added

- Card name to doc title
- redux-batched-subscribe

### Removed

- Selector factories inside HOC

### Optimized

- TaskListItem component
- NotificationList component

### Fixed

- Closing popover on edit tag
- Fetching projectPanelType to firstProject

## [2.44.0] - 2020-08-18

### Changed

- cancel subscription feedback modal

### Fixed

- dropbox link generator

### Added

- Phone number to registration forms
- Persisting last visited projectId/conversationId

## [2.43.0] - 2020-08-12

### Fixed

- simple-markdown elements rendering

### Refactored

- FilesModel

### Added

- Notifying by message on joining video call
- Integromat integration

## [2.42.0] - 2020-08-03

### Added

- Create Card button to MyTasks and SpaceTaskList

## [2.41.0] - 2020-08-03

### Refactored

- unified mentioning

### Fixed

- calculating min items to fetch from chat
- groups appearing from other workspaces

### Changed

- Freemium users limit to 5

### Updated

- old react-giphy-select

## [2.40.0] - 2020-07-28

### Changed

- moved hanguts link to the front
- tracking timeline view
- complete rewrite filters logic
- splitted card breadcrumbs to separate pickers

### Refactored

- TasksTable config

## [2.39.2] - 2020-07-23

### Fixed

- withTooltip issues

### Added

- tooltips to my tasks
- DemoButton

## [2.39.1] - 2020-07-20

### Changed

- move TopMenu to left

### Fixed

- unread notifications badges

## Refactored

- AppsModel to TS
- ActivitiesModel to TS

## [2.39.0] - 2020-07-17

### Added

- Split notifications center into two - chat and action based
- Space groups modal
- ClientNewVersionModalWrapper
- Workspace switcher in main menu

## Refactored

- Notifications components to TS + hooks

### Removed

- sass award modal
- beta info and modals from overwatch and mytasks

### Fixed

- missing invisible conversations in jump to
- fixed invisible guests in group conversation members
- fixed bugged arrow styles for popovers
- fixed not showing new workspaces
- scaling thumbnail

## [2.38.0] - 2020-07-08

### Added

- SpaceTimelineView into ProjectView
- PersonalProjectStructure model
- Ability to drag&drop projects to group or loose
- Creating personal project groups

### Refactored

- SpaceTimeline components to be more composable

### Fixed

- TaskList changed notification text
- Missing task lists data in card modal
- Missing online indicator in notification
- Fetching first-project customFields

### Changed

- Archive all notifications to be optimistic ui

## [2.37.0] - 2020-06-20

### Refactored

- Conversation visibility
- OneTimeDisposableModal DRY
- UniversalPopover and InfoTooltip to full TS + HOOK
- Global modals to 1 place. Separate from App component

### Fixed

- Leaking HTMLDomNodes through uncleared chatItemRefs map
- Unclickable GroupChatNavLink
- useLazyList Hook

### Added

- Sass award modal

### Updated

- react-popper to latest version

## [2.36.0] - 2020-06-09

### Changed

- Chat-with-me invitation token is requested separately through new CustomRelation endpoint
- Workspace settings are available only to workspace admins
- Refactored WorkspaceSettingsPage to TS + hooks
- Load projects and conversations on demand per view
- Load project specific data from resource

### Removed

- getOrganizationViewData request

### Added

- Handle app version information from backend & show alert when current app version is lower

### Updated

- translations
- ReactPlayer to latest version with lazy loading

## [2.35.0] - 2020-05-27

### Added

- MyTasks page
- MyTasks filters
- Sorting task logic
- TaskSortController
- Added show more to tags list if truncate
- Option to close AssigneesPopover on delete myself

### Refactored

- Rewritten CardStartAndDueDateController to TS + hook
- Rewritten CardDetailsBreadcrumbs to TS + hook

### Fixed

- Task Attachment styles

## [2.34.0] - 2020-05-15

### Fixed

- OverwatchPage rerendering
- parsing push notification data

### Removed

- Product roadmap button

### Refactored

- Rewrited tc3jsc to TS and remove ts-ignores

### Added

- Hooks to handle redirects (useRedirect), based on role in organization (useAllowedRoleProtectedRoute, useForbiddenRoleProtectedRoute)

## [2.33.0] - 2020-05-12

### Added

- Universal one-time user disposable information modal
- Overwatch beta performance information one-time modal
- Added chat and board skeletons

### Fixed

- empty view in board while switching spaces

## [2.32.0] - 2020-05-08

### Fixed

- Fixed Unicode emojis in initials
- Fixed selecting projectIdByConversationId for organization
- Fixed querying notifications without archived

### Removed

- Removed organizationViewData request from mobile
- Removed ProjectsModelActions.onInit and recentlyUsedProjects
- organizationPeople from initialData ep
- customFields from organizationViewData ep

### Changed

- Split projects' extensions data to be fetched on viewing specific project

## [2.32.0] - 2020-05-08

### Fixed

- Fixed Unicode emojis in initials
- Fixed selecting projectIdByConversationId for organization
- Fixed querying notifications without archived

### Removed

- Removed organizationViewData request from mobile
- Removed ProjectsModelActions.onInit and recentlyUsedProjects
- organizationPeople from initialData ep
- customFields from organizationViewData ep

### Added

- useLazyList hook
- useRefreshData hook
- fallback granulation to ABTestonGetOrganizationProjects
- getCustomFields endpoint & saga flow
- onGetOrganizationProjects endpoint & saga flow
- onGetConversationSettings endpoint & saga flow

### Updated

- Moved fetching chat notification settings from init to hooks from Spaces list

### Changed

- Action to get Workspace Extensions now accepts namespaces param

### Changed

- refactored getRegistrationParamsFromUrl

## [2.31.0] - 2020-04-15

### Fixed

- Fixed the conditions to display filtered estimate on lists view
- Fixed timeline accessibility condition
- Fixed saving timeline filters
- Fixed app freeze when rendering markdown deeply nested quotes
- Fixed infinite loading screen in TaskDetails

### Added

- Added missing Overwatch premium blocking modal
- Added TaskProgressWithPopover to timeline
- Added myIp endpoint to detect offline

### Updated

- Bumped packages (react, sentry, firebase, others...)

## [2.30.0] - 2020-04-09

### Added

- Added Overwatch view with timelines
- Added ViewSettingsModel for abstract views

### Refactored

- Refactored FiltersModel to TS and hooks

### Changed

- RightPanelChat is invisible by default

## [2.29.3] - 2020-03-27

### Fixed

- Fixed getShadedColor

## [2.29.2] - 2020-03-14

### Fixed

- Fixed ExtensionVisibilityWrapper permissions
- Disabled calendar events for free users

## [2.29.1] - 2020-03-09

### Added

- Added storybook configuration

### Fixed

- Fixed showing tooltip when no emoticon & only white chars
- Fixed the bug in which user's status would not update on reconnection if the status was removed while the client was disconnected
- Fixed new tags having seemingly random colors instead of the one selected ones
- Fixed permission to delete account in non empty organization

## [2.29.0] - 2020-03-04

### Added

- Added archiving all notifications
- Bring back trello integration
- Added JobStatus model
- Added contribution guide and readme
- Added global ApplicationState interface
- Added user status icons to team

### Changed

- Partly migrated from tslint to eslint

### Refactored

- Refactored UsersModel to TypeScript

## [2.28.1] - 2020-03-02

### Fixed

- Fixed requesting first-project messageBoard with wrong uuid
- Fixed annual total cost

### Added

- Added billing period change tracker

### Refactored

- Refactored DirectChatNavLink HOC to Hook component written with TypeScript
- Refactored UserName HOC to Hook component written with TypeScript

## [2.28.0] - 2020-02-14

### Added

- User.com customer messaging platform client
- Added annual plan

### Removed

- intercom dependecy

## [2.27.0] - 2020-02-04

### Performance

- Handle only added/removed userId sent through feed when updating task assignees etc
- Improve and refactor chat virtualization

### Fixed

- Handle task tags data when fetchin task details data
- Fixed ProgressiveFileImage dimensions & scaling
- Fixed mobile crash on inline markdown image

### Added

- Added checklist progress in cards

## [2.26.1] - 2020-01-22

### Fixed

- Fixed hangout channel link generator
- Fixed invite user to project from AssigneeController
- Fixed Badge and SpaceNavLink

### Refactored

- Refactored SpaceNavLink HOC to Hook component written with TypeScript
- Refactored ProjectPlanetIcon HOC to Hook component written with TypeScript
- Refactored Badge HOCs to Hook-based components written with TS

### Added

- LinkPreview to Mobile app

### Fixed

- Fixed checklist input text color (IOS)
- Fixed crash while deleting attachment (IOS)
- Fixed non existent emojis (Mobile)
- Fixed 500 while sending channel hail (Mobile)

## [2.26.0] - 2020-01-16

### Added

- Added french translation
- Checklist item assignees

### Fixed

- Fixed blockQuote styles for Mobile app
- Fixed confusing statement
- Fixed absent converting message to task button in card issue
- Fixed list names issue, made them visible and scrollable
- Fixed user-tracker to use credentials

### Refactored

- Refactored NavLink HOC to Hook component with TypeScript
- Refactored PersonFullName HOC to Hook component written with TypeScript

## [2.25.1] - 2020-01-08

### Added

- Added Zapier app

### Fixed

- Fixed requesting data without current organization
- Fixed Subscription form 500 error with US country
- Restore deleted translations

## [2.25.0] - 2020-01-03

### Fixed

- Fixed message responses
- Fixed Subscription client data form
- Fixed humanMessages translations

### Added

- Added delay on background recourses

### Changed

- Fetching background recourses with one request
- Rewrite TaskListItem and nested components to hooks

### Refactored

- Cleanup translations

## [2.24.0] - 2019-12-17

### Added

- Added Reply to a message
- Added fetching notification data when feed reconnected and user inactive
- Added missing translations
- Added copy task options with attachments

### Changed

- Changed convert to a card comment format

### Fixed

- Fixed authorize oauth2 failure alert
- Fixed delay after leaving space

## [2.23.0] - 2019-12-10

### Added

- Added gh-release
- Added Shared Drives view to Google Drive Picker
- Added Developer Console
- Added new Activity for cards: User Assigned/Removed

### Fixed

- Fixed scroll issues in card comments
- Fixed duplicate cards in Kanban for some cases
- Fixed Infinite loader in Mobile
- Fixed 500 screen in Mobile (navigation-stack)
