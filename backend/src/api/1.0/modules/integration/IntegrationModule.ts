export const IntegrationModule = {
  IntegrationProviderInterface: Symbol('IntegrationProviderInterface'),
  IntegrationController: Symbol('IntegrationController'),
  IntegrationServiceFactoryInterface: Symbol('IntegrationServiceFactoryInterface'),
  ExistingEntitiesServiceInterface: Symbol('ExistingEntitiesServiceInterface'),
  DataImportProjectServiceInterface: Symbol('DataImportProjectServiceInterface'),
  DataImportListServiceInterface: Symbol('DataImportListServiceInterface'),
  DataImportTaskServiceInterface: Symbol('DataImportTaskServiceInterface'),
  DataImportChecklistServiceInterface: Symbol('DataImportChecklistServiceInterface'),
  DataImportTagServiceInterface: Symbol('DataImportTagServiceInterface'),
  DataImportUserInProjectServiceInterface: Symbol('DataImportUserInProjectServiceInterface'),

  ExternalAPIRateLimitsService: Symbol('ExternalAPIRateLimitsService'),

  TrelloDataMapper: Symbol('TrelloDataMapper'),
  TrelloDataImportService: Symbol('TrelloDataImportService'),
  TrelloApiInterface: Symbol('TrelloApiInterface'),
  TrelloDataImportQueue: Symbol('TrelloDataImportQueue'),
  TrelloDataImportJobFactoryInterface: Symbol('TrelloDataImportJobFactoryInterface'),
  TrelloDataImportWorker: Symbol('TrelloDataImportWorker'),
  TrelloDataImportSubWorker: Symbol('TrelloDataImportSubWorker'),

  TrelloApiErrorHandlerInterface: Symbol('TrelloApiErrorHandlerInterface'),
}
