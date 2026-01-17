import { Map } from 'immutable'
import * as IntegrationsModelConstants from './constants'

export function onInit() {
  return {
    type: IntegrationsModelConstants.onInit,
  }
}

export function onStartIntegration(extensionId) {
  return {
    type: IntegrationsModelConstants.onStartIntegration,
    extensionId,
  }
}

export function onFetchIntegrations() {
  return {
    type: IntegrationsModelConstants.onFetchIntegrations,
  }
}

export function onBatchIntegrations(integrations) {
  return {
    type: IntegrationsModelConstants.onBatchIntegrations,
    integrations,
  }
}

export function onCreateIntegration(integration) {
  return {
    type: IntegrationsModelConstants.onCreateIntegration,
    integration: new Map(integration),
  }
}

export function onUpdateIntegration(integration) {
  return {
    type: IntegrationsModelConstants.onUpdateIntegration,
    integration: new Map(integration),
  }
}

export function onConfirmIntegrationsStatus(extensionIds) {
  return {
    type: IntegrationsModelConstants.onConfirmIntegrationsStatus,
    extensionIds,
  }
}

export function onConfirmIntegrationsStatusSuccess(organizationId, userId, extensionIds) {
  return {
    type: IntegrationsModelConstants.onConfirmIntegrationsStatusSuccess,
    extensionIds,
    userId,
    organizationId,
  }
}

export function onSetIntegrationStatus(organizationId, userId, extensionId, status) {
  return {
    type: IntegrationsModelConstants.onSetIntegrationStatus,
    extensionId,
    userId,
    organizationId,
    status,
  }
}
