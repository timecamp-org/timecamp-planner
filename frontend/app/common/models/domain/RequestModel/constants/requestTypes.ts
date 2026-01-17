/* Checklist */
export const createChecklistItem = `createChecklistItem`;
export const removeChecklistItem = `removeChecklistItem`;
export const updateChecklistItem = `updateChecklistItem`;
export const moveChecklistItem = `moveChecklistItem`;
export const convertChecklistItemToCard = `convertChecklistItemToCard`;
export const addChecklistItemAssignee = 'addChecklistItemAssignee';
export const removeChecklistItemAssignee = 'removeChecklistItemAssignee';

/* Current user */
export const authenticateWithCookie = `authenticateWithCookie`;
export const getOrganizations = `getOrganizations`;
export const authenticateToOpenIdWithCookie = `authenticateToOpenIdWithCookie`;
export const registerWithPassword = `registerWithPassword`;
export const registerWithOpenId = `registerWithOpenId`;
export const createOrganization = `createOrganization`;
export const updateOrganization = `updateOrganization`;
export const resetPasswordForUserEmail = `resetPasswordForUserEmail`;
export const emailUpdate = `emailUpdate`;
export const changePasswordForToken = `changePasswordForToken`;
export const changePassword = `changePassword`;
export const checkIfEmailExists = `checkIfEmailExists`;
export const getUserOrganizationSubscriptions = `getUserOrganizationSubscriptions`;
export const deleteCurrentUser = `deleteCurrentUser`;

/* OAuth2 */
export const authorizeOAuth2 = `authorizeOAuth2`;
export const getOauthClientData = `getOauthClientData`;
export const regenerateOauthClientSecret = `regenerateOauthClientSecret`;

/* Files */
export const createFile = `createFile`;
export const removeFile = `removeFile`;
export const fetchContainerFiles = `fetchContainerFiles`;

/* Lists */
export const createList = `createList`;
export const updateList = `updateList`;
export const addUserToTaskListFollowers = `addUserToTaskListFollowers`;
export const removeTaskListFollower = `removeTaskListFollower`;
export const copyListWithTasks = `copyListWithTasks`;
export const getListTasks = `getListTasks`;
export const moveAllTasksInList = `moveAllTasksInList`;

/* Messages */
export const sendMessage = `sendMessage`;
export const updateMessage = `updateMessage`;
export const removeMessage = `removeMessage`;
export const updateMessageRead = `updateMessageRead`;
export const updateMessageKeyPress = `updateMessageKeyPress`;
export const addMessageReaction = `addMessageReaction`;
export const removeMessageReaction = `removeMessageReaction`;
export const getMessagesMetadata = `getMessagesMetadata`;
export const getMessageBoard = `getMessageBoard`;
export const initiallyFetchChatItems = `initiallyFetchChatItems`;
export const fetchMoreChatItems = `fetchMoreChatItems`;
export const deleteLinkPreview = `deleteLinkPreview`;

/* Notifications */
export const deleteUserPushDevice = `deleteUserPushDevice`;
export const getDeviceId = `getDeviceId`;
export const updateUserPushDevice = `updateUserPushDevice`;
export const archiveUserNotifications = `archiveUserNotifications`;
export const updateNotification = `updateNotification`;
export const updateNotificationsSettings = `updateNotificationsSettings`;
export const getUserNotifications = `getUserNotifications`;
export const getUserUnreadNotifications = `getUserUnreadNotifications`;
export const getUserAllUnreadNotifications = `getUserAllUnreadNotifications`;
export const readObjectUserUnreadNotifications = `readObjectUserUnreadNotifications`;
export const readAllUserUnreadNotifications = `readAllUserUnreadNotifications`;
export const getNotificationsSettings = `getNotificationsSettings`;
export const setChatNotificationSettingsType = `setChatNotificationSettingsType`;
export const fetchChatNotificationSettingsTypes = `fetchChatNotificationSettingsTypes`;
export const archiveUserInOrganizationNotifications = `archiveUserInOrganizationNotifications`;
export const getUserLatestAllNotificationCenterDisplays = `getUserLatestAllNotificationCenterDisplays`;

/* Organizations */
export const inviteUserToOrganization = `inviteUserToOrganization`;
export const inviteUsersToConversations = `inviteUsersToConversations`;
export const inviteGuestsToOrganization = `inviteGuestsToOrganization`;
export const resendInvitationToOrganization = `resendInvitationToOrganization`;
export const generateInvitationLink = `generateInvitationLink`;
export const getOrganization = `getOrganization`;
export const getOrganizationPeople = `getOrganizationPeople`;
export const createWorkspace = `createWorkspace`;
export const getOrganizationExtensions = `getOrganizationExtensions`;
export const updateExtensionStatusInOrganization = `updateExtensionStatusInOrganization`;
export const deactivateUserFromOrganization = `deactivateUserFromOrganization`;
export const reactivateUserFromOrganization = `reactivateUserFromOrganization`;
export const updateUserRole = `updateUserRole`;
export const getArchivedProjectsViewData = `getArchivedProjectsViewData`;
export const getLatestActiveUserConversations = `getLatestActiveUserConversations`;
export const deleteGuestFromAllSpaces = `deleteGuestFromAllSpaces`;
export const getUserOrganizationRoles = `getUserOrganizationRoles`;
export const getOrganizationProjectsGuestInProject = 'getOrganizationProjectsGuestInProject';

/* Projects */
export const createProject = `createProject`;
export const updateProject = `updateProject`;
export const addUserToProjectPeople = `addUserToProjectPeople`;
export const updateProjectPeopleRole = `updateProjectPeopleRole`;
export const removeProjectPeopleRole = `removeProjectPeopleRole`;
export const addUserToProjectFollowers = `addUserToProjectFollowers`;
export const removeProjectFollower = `removeProjectFollower`;
export const setProjectLatestVisist = `setProjectLatestVisist`;

export const getProject = `getProject`;
export const getProjectViewData = `getProjectViewData`;
export const getConversationViewData = `getConversationViewData`;
export const getProjectLists = `getProjectLists`;
export const getProjectTasks = `getProjectTasks`;
export const getProjectListsAndTasks = `getProjectListsAndTasks`;
export const updateConversationVisibility = `updateConversationVisibility`;
export const copySpace = `copySpace`;
export const createConversationIfDoesNotExist = `createConversationIfDoesNotExist`;
export const getOrganizationProjectsPeople = `getOrganizationProjectsPeople`;
export const getOrganizationProjects = `getOrganizationProjects`;
export const getOrganizationProjectsHaveUnreadMessages = `getOrganizationProjectsHaveUnreadMessages`;
export const getConversationSettings = `getConversationSettings`;

/* Projects user settings */
export const updateUserProjectSettings = `updateUserProjectSettings`;
export const getUserProjectSettings = `getUserProjectSettings`;

/* Tags */
export const getOrganizationTags = `getOrganizationTags`;
export const createTag = `createTag`;
export const deleteTag = `deleteTag`;
export const updateTag = `updateTag`;
export const attachTagToTask = `attachTagToTask`;
export const detachTagFromTask = `detachTagFromTask`;
export const getOrganizationTagsOverview = 'getOrganizationTagsOverview';

/* Tasks */
export const createTask = `createTask`;
export const updateTask = `updateTask`;
export const addUserToTaskPeople = `addUserToTaskPeople`;
export const removeTaskPeopleRole = `removeTaskPeopleRole`;
export const addUserToTaskFollowers = `addUserToTaskFollowers`;
export const removeTaskFollower = `removeTaskFollower`;
export const addTaskAttachment = `addTaskAttachment`;
export const removeTaskAttachment = `removeTaskAttachment`;
export const copyTask = `copyTask`;
export const getUserLatestVisitedTasks = `getUserLatestVisitedTasks`;

// TaskTimeEstimates
export const createTaskTimeEstimate = 'createEstimate';
export const updateTaskTimeEstimate = 'updateEstimate';
export const deleteTaskTimeEstimate = 'deleteEstimate';
export const getTaskTimeEstimate = 'getEstimate';

/* Users */
export const updateCurrentUser = `updateCurrentUser`;
export const passwordUpdate = `passwordUpdate`;

/* Activity feed */
export const subscribeActivityFeed = `subscribeActivityFeed`;

/* Extensions */

export const updateExtensionRelation = 'updateExtensionRelation';
export const deleteExtensionRelation = 'deleteExtensionRelation';
export const fetchIntegrations = 'fetchIntegrations';
export const confirmIntegrations = 'confirmIntegrations';
export const fetchCustomRelation = 'fetchCustomRelation';

/* CustomFields */
export const getCustomFields = `getCustomFields`;
export const updateCustomFields = `updateCustomFields`;

/* Subscriptions */
export const checkoutSubscriptionPaymentPage = 'checkoutSubscriptionPaymentPage';
export const getSubscriptionViewData = 'getSubscriptionViewData';
export const getSubscriptionInvoices = 'getSubscriptionInvoices';
export const updateSubscription = 'updateSubscription';
export const downloadInvoice = 'downloadInvoice';

/* OAuth1 */
export const redirectToAuthorizeOAuth1 = 'redirectToAuthorizeOAuth1';
export const authorizeOAuth1 = 'authorizeOAuth1';
export const fetchOAuth1AuthorizedApplications = 'fetchOAuth1AuthorizedApplications';
export const deauthorizeOAuth1 = 'deauthorizeOAuth1';

/* User status */
export const getOrganizationUserStatuses = 'getOrganizationUserStatuses';
export const setUserStatus = 'setUserStatus';
export const deleteUserStatus = 'deleteUserStatus';

/* Export data */
export const getExportedData = 'getExportedData';

/* Others */
export const getLinkMetadata = 'getLinkMetadata';
export const getTaskDetails = `getTaskDetails`;

export const cancelOrganizationSubscription = 'cancelOrganizationSubscription';

export const onSendUserFeedback = 'onSendUserFeedback';
export const getUserInitialData = 'getUserInitialData';

export const getDidUserCloseModalUltimately = 'getDidUserCloseModalUltimately';

/* Chat with me */
export const joinChatWithMe = 'joinChatWithMe';
export const getChatWithMeInvitationData = 'getChatWithMeInvitationData';

/* Apps*/
export const createUserApp = 'createUserApp';
export const getUserApps = 'getUserApps';
export const updateUserApp = 'updateUserApp';
export const deleteUserApp = 'deleteUserApp';
export const addUserAppCollaborator = `addUserAppCollaborator`;
export const removeUserAppCollaborator = `removeUserAppCollaborator`;
export const inviteUserAppCollaborator = `inviteUserAppCollaborator`;

/* Jobs */
export const getUserInOrganizationJobStatuses = 'getUserInOrganizationJobStatuses';

/* VIew Settings */
export const createLinkedViewSettingsForBaseView = 'createLinkedViewSettingsForBaseView';
export const createViewSettingsWithLinkedSettings = 'createViewSettingsWithLinkedSettings';
export const getViewSettings = 'getViewSettings';
export const getViewSettingsById = 'getViewSettingsById';
export const deleteViewSettings = 'deleteViewSettings';
export const deleteViewSettingsById = 'deleteViewSettingsById';
export const updateViewSettings = 'updateViewSettings';
export const updateViewSettingsBody = 'updateViewSettingsBody';
export const createViewSettingsLink = 'createViewSettingsLink';
export const deleteViewSettingsLink = 'deleteViewSettingsLink';

/* Personal project structure */
export const getPersonalProjectStructure = 'getPersonalProjectStructure';
export const createProjectGroup = 'createProjectGroup';
export const updateProjectGroup = 'updateProjectGroup';
export const deleteProjectGroup = 'deleteProjectGroup';
export const moveProjectInStructure = 'moveProjectInStructure';

/* Schedule */
export const getScheduleData = 'getScheduleData';
/* Tags */
export const getOrganizationGroups = `getOrganizationGroups`;

// Timecamp integration
export const saveTimecampApiToken = 'createTimecampApiToken';
export const setTimer = 'setTimer';
export const getHasIntegration = 'setTimer';
export const checkTaskTimer = 'checkTaskTimer';
export const getAllEntries = 'getAllEntries';
export const addTimeEntry = 'addEntry';
