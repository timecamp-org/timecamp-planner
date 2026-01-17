export interface LoggerInterface {
  debug(primaryMessage: string, ...context: any[]): void;
  warn(primaryMessage: string, ...context: any[]): void;
  error(primaryMessage: string | Error, ...context: any[]): void;
  info(primaryMessage: string, ...context: any[]): void;
}
