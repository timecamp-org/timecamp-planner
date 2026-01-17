# Changelog
All notable changes to Planner for iOS will be documented in this file.

### Unreleased
## [1.4.4] - 4.03.2021
### Fixed
- Crash while navigating to not created conversation
- Rewrited Image preview
- Showing mention picker on some cases
- Cutting off some messages on loading app from sleep state

## [1.4.3] - 26.10.2020

### Added
- Sign in/up with Apple

### Fixed
- Crashes on kanban view
- Multiline input in chat

### Removed
- IntercomController in favor of SupportScreen

## [1.4.0] - 17.07.2020

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

## [1.3.0] - 21.04.2020

### Changed 
- Workspace extensions data is no longer loaded on app initialization. Now it only loads relevant extensions (agile) on relevant views (kanban).
- Significantly reduced the amount of data downloaded on app initialization by removing organizationViewData request. Projects data (for teams and spaces menu) are now requested in their relevant components along with conversation settings.
- TeamNavButtonList and SpaceNavButtonList refactored to TS + hooks

### Added
- Dynamic item rendering in TeamNavButtonList and SpaceNavButtonList components
- Take photo and share inside Planner
- Record video and share inside Planner
- Choose available video files
- Skeleton loaders for Team and Space sections

### Updated
- Bumped to latest react-native version with some build packages

### Fixed
- Uploading photos from app
- babel.config.js recursive resolving, causing long bundling
- Push notifications now redirects to correct route immidiately with background and foreground flow
- Navigation tabs in conversation view incorrectly displaying their state
- Fixed disappearing chat items
- Fixed uploading photos

## [1.2.0] - 03.04.2020

### Added
- Added image attachment view modal instead of automatic download
- Added changelog

### Changed
- iOS: added context menu on image attachment long press in chat like it already was on Android
