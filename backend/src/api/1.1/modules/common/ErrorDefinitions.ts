import { HttpStatus } from '../../../../infrastructure/enum';

export enum Type {
  INVALID_AUTH_TOKEN,
  INVALID_REQUEST_KEY,
  UNAUTHORIZED,
  INTERNAL,
  NOT_IMPLEMENTED_CONTAINER_TYPE,
  CONTAINER_NOT_FOUND,
  EMAIL_ALREADY_IN_USE,
  VALIDATION_FAILED,
  TASK_NOT_FOUND,
  TASK_PEOPLE_NOT_FOUND,
  TASK_ALREADY_EXISTS,
  PROJECT_NOT_FOUND,
  CONVERSATION_NOT_FOUND,
  PROJECT_ALREADY_EXISTS,
  PROJECT_PEOPLE_NOT_FOUND,
  LIST_NOT_FOUND,
  LIST_ALREADY_EXISTS,
  TAG_NOT_FOUND,
  TAG_ALREADY_EXISTS,
  CHECKLIST_ITEM_ALREADY_EXISTS,
  CHECKLIST_ITEM_NOT_FOUND,
  USER_ALREADY_IN_CHECKLIST_ITEM,
  CHECKLIST_ASSIGNEE_NOT_FOUND,
  FILE_ALREADY_EXISTS,
  FILE_NOT_FOUND,
  FILE_NOT_OWNED_BY_USER,
  USER_NOT_FOUND,
  ACCOUNT_DELETED,
  USER_ALREADY_EXISTS,
  NOTIFICATION_NOT_FOUND,
  NOTIFICATION_ALREADY_EXISTS,
  ORGANIZATION_ALREADY_EXISTS,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_IN_ORGANIZATION,
  USER_ALREADY_IN_ORGANIZATION,
  USER_ALREADY_IN_PROJECT,
  MESSAGE_NOT_FOUND,
  MESSAGE_ALREADY_EXISTS,
  REACTION_NOT_FOUND,
  REACTION_ALREADY_EXISTS,
  REACTION_FOR_USER_EXISTS,
  USER_ALREADY_IN_TASK,
  TASK_ALREADY_HAS_TAG,
  TASK_TAG_NOT_FOUND,
  TASK_ATTACHMENT_NOT_FOUND,
  USER_ALREADY_FOLLOWING_PROJECT,
  PROJECT_FOLLOWER_NOT_FOUND,
  USER_ALREADY_FOLLOWING_LIST,
  LIST_FOLLOWER_NOT_FOUND,
  USER_ALREADY_FOLLOWING_TASK,
  TASK_FOLLOWER_NOT_FOUND,
  LIST_WITH_ORDER_ALREADY_EXISTS,
  TASK_WITH_ORDER_ALREADY_EXISTS,
  CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS,
  CUSTOM_FIELD_INCORRECT,
  CUSTOM_FIELD_NAMESPACE_INCORRECT,
  CUSTOM_RELATION_INCORRECT,
  EXTENSION_NOT_FOUND,
  RESOURCE_NOT_FOUND,
  RESOURCE_ALREADY_EXISTS,
  INVITER_NOT_FOUND,
  INVITED_USER_NOT_FOUND,
  USER_LIMIT_EXCEEDED,
  NOT_PERMITTED,
  TOO_MANY_REQUESTS,
  RESPONSE_HANDLER_NOT_FOUND,
  TASK_DUE_DATE_EARLIER_THAN_START_DATE,
  NOT_ENOUGH_GUEST_SEATS,
  INTEGRATION_NOT_IMPLEMENTED,
  INTEGRATION_ALREADY_IN_PROGRESS,
  USER_IN_ORGANIZATION_NOT_FOUND,
  FEEDBACK_ALREADY_EXISTS,
  VIEW_TYPE_NOT_FOUND,
  SETTINGS_TYPE_NOT_FOUND,
  SETTINGS_NOT_FOUND,
  VIEW_SETTINGS_NOT_FOUND,
  VIEW_SETTINGS_ALREADY_EXISTS,
  LINKED_VIEW_SETTINGS_ALREADY_EXISTS,
  MISSING_BODY_PARAMETER,
  PROJECT_GROUP_NOT_FOUND,
  SUBSCRIPTION_REQUIRED,
  USER_NOT_IN_PROJECT,
  TOKEN_NOT_FOUND,
  PROJECT_TEMPLATE_NOT_FOUND,
  NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE,
  TEMPLATE_ENTITY_NOT_FOUND,
  TEMPLATE_ENTITY_NOT_CREATED,
  ORGANIZATION_ID_NOT_PROVIDED,
  GLOBAL_TEMPLATE_NOT_UNIQUE_NAME,
  USER_NOT_ORGANIZATION_OWNER,
  WEBHOOK_NOT_FOUND,
  WEBHOOK_NOT_OWNED,
  INVALID_CALLBACK_URL,
}

export class ErrorResponse {
  public httpStatus: number;
  public errorCode: number;
  public body: string;

  constructor(httpStatus: number, errorCode: number, body: string, messageParams?: any[]) {
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.body = body;
  }
}

export default {
  [Type.TASK_NOT_FOUND]: new ErrorResponse(404, 404, 'Task not found'),
  [Type.TASK_PEOPLE_NOT_FOUND]: new ErrorResponse(404, 404, 'Task people not found'),
  [Type.PROJECT_NOT_FOUND]: new ErrorResponse(404, 404, 'Project not found'),
  [Type.PROJECT_PEOPLE_NOT_FOUND]: new ErrorResponse(404, 404, 'Project people not found'),
  [Type.CONVERSATION_NOT_FOUND]: new ErrorResponse(404, 404, 'Conversation not found'),
  [Type.LIST_NOT_FOUND]: new ErrorResponse(404, 404, 'List not found'),
  [Type.CHECKLIST_ITEM_NOT_FOUND]: new ErrorResponse(404, 404, 'Checklist item not found'),
  [Type.USER_ALREADY_IN_CHECKLIST_ITEM]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already in checklist item'),
  [Type.CHECKLIST_ASSIGNEE_NOT_FOUND]: new ErrorResponse(404, 404, 'Checklist assignee not found'),
  [Type.FILE_NOT_FOUND]: new ErrorResponse(404, 404, 'File not found'),
  [Type.FILE_NOT_OWNED_BY_USER]: new ErrorResponse(403, 403, 'File not owned by user'),
  [Type.USER_NOT_FOUND]: new ErrorResponse(404, 404, 'User not found'),
  [Type.ACCOUNT_DELETED]: new ErrorResponse(404, 404, 'Account deleted'),
  [Type.NOTIFICATION_NOT_FOUND]: new ErrorResponse(404, 404, 'Notification not found'),
  [Type.TASK_TAG_NOT_FOUND]: new ErrorResponse(404, 404, 'Task tag not found'),
  [Type.TASK_ATTACHMENT_NOT_FOUND]: new ErrorResponse(404, 404, 'Task attachment not found'),
  [Type.PROJECT_FOLLOWER_NOT_FOUND]: new ErrorResponse(404, 404, 'Project follower not found'),
  [Type.LIST_FOLLOWER_NOT_FOUND]: new ErrorResponse(404, 404, 'List follower not found'),
  [Type.TASK_FOLLOWER_NOT_FOUND]: new ErrorResponse(404, 404, 'Task follower not found'),
  [Type.RESOURCE_NOT_FOUND]: new ErrorResponse(404, 404, 'Resource not found'),
  [Type.RESOURCE_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Resource already exists'),
  [Type.TASK_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Task already exists'),
  [Type.PROJECT_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Project already exists'),
  [Type.LIST_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'List already exists'),
  [Type.CHECKLIST_ITEM_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Checklist item already exists'),
  [Type.FILE_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'File already exists'),
  [Type.FEEDBACK_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'FeedbackJson already exists'),
  [Type.INVALID_AUTH_TOKEN]: new ErrorResponse(401, 401, 'Invalid auth response'),
  [Type.INVALID_REQUEST_KEY]: new ErrorResponse(403, 403, 'Invalid request key'),
  [Type.INTERNAL]: new ErrorResponse(500, 500, 'Internal error'),
  [Type.UNAUTHORIZED]: new ErrorResponse(403, 403, 'Unauthorized'),
  [Type.EMAIL_ALREADY_IN_USE]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Email already in use'),
  [Type.USER_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already exists'),
  [Type.NOTIFICATION_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Notification already exists'),
  [Type.ORGANIZATION_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Organization already exists'),
  [Type.ORGANIZATION_NOT_FOUND]: new ErrorResponse(404, 404, 'Organization not found'),
  [Type.USER_NOT_IN_ORGANIZATION]: new ErrorResponse(403, 403, 'User not in organization'),
  [Type.USER_ALREADY_IN_ORGANIZATION]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already in organization'),
  [Type.USER_ALREADY_IN_PROJECT]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already in project'),
  [Type.NOT_IMPLEMENTED_CONTAINER_TYPE]: new ErrorResponse(400, 400, 'Not implemented container type'),
  [Type.CONTAINER_NOT_FOUND]: new ErrorResponse(404, 404, 'Message container not found'),
  [Type.TAG_NOT_FOUND]: new ErrorResponse(404, 404, 'Tag not found'),
  [Type.TAG_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Tag already exists'),
  [Type.MESSAGE_NOT_FOUND]: new ErrorResponse(404, 404, 'Message not found'),
  [Type.MESSAGE_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Message already exists'),
  [Type.REACTION_NOT_FOUND]: new ErrorResponse(404, 404, 'Reaction not found'),
  [Type.REACTION_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Reaction already exists'),
  [Type.REACTION_FOR_USER_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Reaction for user already exists'),
  [Type.USER_ALREADY_IN_TASK]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already in task'),
  [Type.TASK_ALREADY_HAS_TAG]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Task already has tag'),
  [Type.USER_ALREADY_FOLLOWING_PROJECT]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already following project'),
  [Type.USER_ALREADY_FOLLOWING_LIST]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already following list'),
  [Type.USER_ALREADY_FOLLOWING_TASK]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'User already following task'),
  [Type.LIST_WITH_ORDER_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'List with order already exists'),
  [Type.TASK_WITH_ORDER_ALREADY_EXISTS]: new ErrorResponse(HttpStatus.CONFLICT, 409, 'Task with order already exists'),
  [Type.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS]: new ErrorResponse(
    HttpStatus.CONFLICT,
    409,
    'Checklist item with order already exists'
  ),
  [Type.CUSTOM_FIELD_INCORRECT]: (fieldName) =>
    new ErrorResponse(HttpStatus.BAD_REQUEST, 400, `Incorrect or unknown custom field: ${fieldName}`, [fieldName]),
  [Type.CUSTOM_FIELD_NAMESPACE_INCORRECT]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    400,
    'Incorrect or unknown custom field'
  ),
  [Type.CUSTOM_RELATION_INCORRECT]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    400,
    'Incorrect or unknown custom relation',
    []
  ),
  [Type.EXTENSION_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'Extension not found', []),
  [Type.INVITER_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'Inviter not found'),
  [Type.INVITED_USER_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Invited user not found'
  ),
  [Type.USER_LIMIT_EXCEEDED]: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    HttpStatus.FORBIDDEN,
    'Too much users in workspace'
  ),
  [Type.NOT_PERMITTED]: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    HttpStatus.FORBIDDEN,
    'Not permitted to do such action'
  ),
  [Type.TOO_MANY_REQUESTS]: new ErrorResponse(
    HttpStatus.TOO_MANY_REQUESTS,
    HttpStatus.TOO_MANY_REQUESTS,
    'Too many requests in a given amount of time'
  ),
  [Type.RESPONSE_HANDLER_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Reponse handler not found'
  ),
  [Type.TASK_DUE_DATE_EARLIER_THAN_START_DATE]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Task due date earlier than start date'
  ),
  [Type.NOT_ENOUGH_GUEST_SEATS]: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    HttpStatus.FORBIDDEN,
    'Not enough guest seats in organization'
  ),
  [Type.INTEGRATION_NOT_IMPLEMENTED]: new ErrorResponse(
    HttpStatus.NOT_IMPLEMENTED,
    HttpStatus.NOT_IMPLEMENTED,
    'Integration not implemented'
  ),
  [Type.INTEGRATION_ALREADY_IN_PROGRESS]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Integration already in progress'
  ),
  [Type.USER_IN_ORGANIZATION_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'User in organization not found'
  ),
  [Type.VIEW_TYPE_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'View type not found'),
  [Type.VIEW_SETTINGS_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'View settings not found'
  ),
  [Type.VIEW_SETTINGS_ALREADY_EXISTS]: new ErrorResponse(
    HttpStatus.CONFLICT,
    HttpStatus.CONFLICT,
    'View settings already exists'
  ),
  [Type.LINKED_VIEW_SETTINGS_ALREADY_EXISTS]: new ErrorResponse(
    HttpStatus.CONFLICT,
    HttpStatus.CONFLICT,
    'View settings link already exists'
  ),
  [Type.MISSING_BODY_PARAMETER]: new ErrorResponse(
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.UNPROCESSABLE_ENTITY,
    'Request is missing a parameter in its body'
  ),
  [Type.PROJECT_GROUP_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Project group not found'
  ),
  [Type.SUBSCRIPTION_REQUIRED]: new ErrorResponse(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN, 'Subscription required'),
  [Type.USER_NOT_IN_PROJECT]: new ErrorResponse(
    HttpStatus.FORBIDDEN,
    HttpStatus.FORBIDDEN,
    'User is not a project member'
  ),
  [Type.SETTINGS_TYPE_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Settings type not found'
  ),
  [Type.SETTINGS_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'Settings not found'),
  [Type.TOKEN_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'Token not found'),
  [Type.PROJECT_TEMPLATE_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Project template not found'
  ),
  [Type.NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Not supported template entity type'
  ),
  [Type.TEMPLATE_ENTITY_NOT_FOUND]: new ErrorResponse(
    HttpStatus.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Template entity not found'
  ),
  [Type.TEMPLATE_ENTITY_NOT_CREATED]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Error creating template entity'
  ),
  [Type.ORGANIZATION_ID_NOT_PROVIDED]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Organization id required to create template'
  ),
  [Type.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Global template has to have unique name'
  ),
  [Type.INVALID_CALLBACK_URL]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'Invalid callback url'
  ),
  [Type.USER_NOT_ORGANIZATION_OWNER]: new ErrorResponse(
    HttpStatus.BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    'User does not own any organization'
  ),
  [Type.WEBHOOK_NOT_FOUND]: new ErrorResponse(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND, 'Webhook does not exist'),
  [Type.WEBHOOK_NOT_OWNED]: new ErrorResponse(
    HttpStatus.UNAUTHORIZED,
    HttpStatus.UNAUTHORIZED,
    'Webhook does not belong to uses'
  ),
};
