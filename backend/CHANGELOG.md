# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Cards limit extension

## [2.50.0] - 2021-12-07

### Fixed

- Add checking user in organization in project permission
- Fetching task followers with union with assigness in some places
- Pagination limit increased to 100
- recurring cards for months interval

### Updated

- Update calendly link

### Added

- Upgrade/downgrade internal mail
- Storing client ip to user schema
- User in organization settings module

### Alters

- 1.38.0
- 1.38.1
- 1.38.2
- 1.38.3
- 1.38.4
- 1.39.0
- 1.40.0

### Fixed

- Import original trello cards and lists orders
- Loose lastName validation in payments & fix error

### Refactored

- Changed guests param name to guests mails

## [2.44.0] - 2020-09-21

### Alters

- 1.37.1

### Fixed

- Issue with saving settings from duplicate containers
- moving archived tasks from list to list

### Added

- packaging trial mails

## [2.43.0] - 2020-09-14

### Alters

- 1.36.3
- 1.37.0

### Added

- userInOrganizationId to mail sent table

## [2.42.0] - 2020-08-28

### Alters

- 1.36.1
- 1.36.2

### Removed

- notificationsDisplayedAt from user model

### Added

- ALL notification center type

## [2.41.0] - 2020-08-18

### Fixed

- custom message createdAt

### Added

- missing responses from checklist item and list posts
- UserLastViewedProject table
- endpoint to set last viewed project

### Changed

- initial data request now returns record form UserLastViewedProject table or fallbacks to first project

### Alters

- 1.36.0

## [2.40.1] - 2020-08-03

### Changed

- freemium user limits
- turned on permissions for project structure extension

### Alters

- 1.35.3

## [2.40.0] - 2020-07-23

### Added

- endpoint for all notifications display from all workspaces

### Fixed

- missing trx

### Chaned

- welcome mail

### Alters

- 1.35.2

## [2.39.0] - 2020-07-17

### Changed

- delete conflicting entry when changing project orders
- placeProjectOnTop throws error if target project is grouped

### Added

- project people endpoint

### Fixed

- deleting guest_in_project while deactivating from ws
- fetching common projects and conversation guests

### Alters

- 1.35.1

## [2.38.0] - 2020-07-09

### Fixed

- Clearing unregistered push devices

### Removed

- OneSignal

### Added

- PersonalProjectStructure module along with corresponding tables
- ProjectsWorker

### Alters

- 1.34.0

## [2.37.0] - 2020-07-07

### Added

- Chargebee cancel_reason to mail
- Subscription activation mail

### Updated

- Bump most of packages

### Fixed

- Organization people resource for workspace admin
- Missing activity from copied card
- Messy trello jobs locking queue

### Changed

- Oauth1 tokens never expire

## [2.36.0] - 2020-06-09

### Alters

- 1.32.0
- 1.33.0

### Added

- implementation OrganizationPeopleResource
- OrganizationPeople in ProjectPeople feed trigger
- new table for storing currently deployed app version (for now only web frontend is handled but this functionality is universal and easy to extend for mobile apps)
- endpoint for getting currently deployed app version
- broadcasting new app version number through feed

### Changed

- getOrganizationPeople endpoint filters out guests that shouldn't be returned

## [2.35.0] - 2020-05-12

### Alters

- 1.31.0

### Added

- board and chat view types to view_type DB table

### Fixed

- counting occupied guest seat count for deleted users
- updating projectPeople permissions
- Fixed extension custom fields view permissions

## [2.34.0] - 2020-04-30

### Alters

- 1.30.2

### Added

- implementation OrganizationProjectsResource
- implementation ProjectResource
- implemented getUserOrganizationConversationsSettings
- Filter out invisible conversations from query

### Fixed

- getCustomFields ep
- Fixed Activity changed prop with equality checking of changes

### Removed

- organizationPeople form initialData ep
- customFields from organizationViewData ep

### Changed

- Modified Workspace Extensions endpoint to accept query parameter to list only specified extensions
- Get project endpoint format

### Refactored

- Refactored Extensions Module to use AbstractResource pattern
- getOrganizationProjects endpoint uses OrganizationProjectsResource now
- Resources generic types

## [2.33.0] - 2020-04-20

### Fixed

- Fixed overwatch permissions
- Fixed getTasksCount organizationId Case

### Added

- Added checklists to projectTasks resource
- Added myIp endpoint

### Changed

- Bumped knex, pg and other libraries

## [2.32.0] - 2020-04-08

### Alters

- 1.30.1

### Fixed

- Fixed messed queryBuilder in message metadata query

### Added

- Added additional view settings endpoints

## [2.31.1] - 2020-03-25

### Added

- Added create view settings with linked settings endpoint
- Added additional permissions
- Added defaultsDeepPreserveArrays helper

### Fixed

- Fixed update inexistend view settings permissions

### Changed

- Disabled [debug] logs in production

## [2.31.0] - 2020-03-23

### Alters

- 1.30.0

### Updates

- Updated Typescript and knex to latest versions
- Updated all packages to latest version
- Make ProcessManagerPlugin as dev only plugin (unbind api process from others)

### Fixed

- Fixed many connection typings
- Fixed removeProjectMember service (updating unnecessary tasks)

### Added

- Added settings module with View settings and linked View settings
- Added dictionaries module (replacement for enums)
- Added first implementation of Resource (ProjectTasksResource) with query and pagination decoration

### Refactored

- Refactored DbConnection module

## [2.30.1] - 2020-03-14

### Fixed

- Fixed permission to delete account in non empty organization
- Fxied & Refactored extension permissions

### Updates

- Updated pm2 and other packages

## [2.30.0] - 2020-03-04

### Alters

- 1.28.0
- 1.28.1
- 1.29.0

### Changed

- Separated feed with plugins to isolated process

### Removed

- Removed Intercom analytics engine

### Added

- Added subscription changes email notifier with reason
- Added MessageQueue module with amqp implementation
- Added job factories and workers for trello import and notifications archiving

### Fixed

- Fixed long subquery
- Add missing transaction instances

### Updated

- Updated pg package

### Refactored

- Use injected connection instead of hard import of queryBuilder

### Updated

- Updated pg package

## [2.21.0] - 2020-02-06

### Alters

- 1.27.0

### Fixed

- Add shipment log switcher to config
- Updating organization data by organization admin
- Send tags data with task view data

### Added

- Added Checklist item basic data
- Added optional projectId to initial data request

### Changed

- Updated bcrypt

## [2.20.1] - 2020-01-20

### Alters

- 1.26.1

### Fixed

- Fixed delete account permission
- Fixed possible tag import issue
- Fixed rendering not-quill push direct messages
- Fixed trello integration with duplicate tags

### Performance

- Improved messages endpoint
- Send only added/removed userId through feed when updating task assignees etc

## [2.20.0] - 2020-01-16

### Alters

- 1.26.0

### Added

- Added Checklist item assignees

### Changed

- Changed Raven to latest Sentry/node
- Upgraded TypeScript to 3.0

### Fixed

- Fixed permission services errors

## [2.19.0] - 2020-01-03

### Fixed

- Fixed create project with people backward compatibilty
- Enabled update project people route permission
- Fixed cancelling lifetime subscriptions (turn off manual cancellation)

### Changed

- Changed Sentry DSN

### Added

- Added frontend background recourses EP

## [2.18.0] - 2019-12-19

### Added

- Added attachments to copied tasks
- Added removing file logic when detaching task attachment
  Added projects people and projects have unread messages endpoints

## [2.17.0] - 2019-12-17

### Added

- Added archive user notifications in organization EP

### Fixed

- Fixed error responses from OAuth2 actions

## [2.16.0] - 2019-12-10

### Alters

- 1.24.1
- 1.25.0

### Added

- Added Get Custom Field Value endpoint
- Added coupons
- Added startDate to ICAL export
- Added background push sound for IOS
- Added next billing amount estimate
- Added missing knex transactions
- Added additional message source data for task
- Added missing endpoints that might be usable for users
- Added developer console infrastructure
- Added OAuth2 client secret regeneration
- Added task assignee activity
- Added ability to request blurred progressive image

### Fixed

- Fixed 500 from subscription hook
- Fixed rate limit key handler
- Fixed importing private trello boards
- Fixed TaskDetails request
- Fixed exporting archived entities to ICAL
- Fixed messages and reaction permissions
- Fixed missing @here MESSAGE notification
- Fixed escaped notification content

### Changed

- Selective feed only for those who really need feed entities
- Changed invitation email
- Merged onboarding bot messages to one

### Removed

- Removed empty arrays from ProjectView request
- Removed onboarding emails
