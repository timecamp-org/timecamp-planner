export class CommandAlreadyDefined extends Error {
  constructor(name: string) {
    super(`Command "${name}" is already defined! Cannot redefine console command.`);
  }
}

export class CommandNotDefined extends Error {
  constructor(name: string) {
    super(`Unknown command "${name}"!`);
  }
}