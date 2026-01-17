# Changelog
All notable changes to Planner for Android will be documented in this file.

### Unreleased


## [1.6.9] - 4.03.2021
### Fixed
- Showing mention picker on some cases
- Cutting off some messages on loading app from sleep state

## [1.6.8] - 31.01.2021
### Fixed
- Crashes on kanban view
- Multiline input in chat
- Disable toggle follow button for user assigned to task in mobile app
- Crash while navigating to not created conversation
- Pressing back button to empty screen
- Rewrited Image preview

### Removed
- IntercomController in favor of SupportScreen

## [1.6.0] - 17.07.2020

### Added
- Chat skeleton loader
- Workspace logo in switcher

### Changed
- Rewrited WorkspaceSwitcher

### Fixed
- Fix google sign in intl hermes issue
- onPushNotification background routing
- opening CreateSpaceModal from empty page
- screen flickering due to not working lazy loading
- searching mention suggestions

## [1.5.0] - 21.04.2020

### Changed
- Workspace extensions data is no longer loaded on app initialization. Now it only loads relevant extensions (agile) on relevant views (kanban).
- Significantly reduced the amount of data downloaded on app initialization by removing organizationViewData request. Projects data (for teams and spaces menu) are now requested in their relevant components along with conversation settings.
- TeamNavButtonList and SpaceNavButtonList refactored to TS + hooks

### Added
- Dynamic item rendering in TeamNavButtonList and SpaceNavButtonList components
- Skeleton loaders for Team and Space sections

### Updated
- Bumped to latest react-native version with some build packages

### Fixed
- babel.config.js recursive resolving, causing long bundling
- Push notifications now redirects to correct route immidiately with background and foreground flow
- Fixed disappearing chat items

## [1.4.1] - 07.04.2020

### Fixed
- Fixed crashes that would occur on nested list markdown rendering attempt

## [1.4.0] - 03.04.2020

### Added
- Added image attachment view modal instead of automatic download
- Added context menu for card attachments
- Added changelog
