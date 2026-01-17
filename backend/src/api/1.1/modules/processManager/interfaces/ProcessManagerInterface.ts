import { ProcessName, ProcessDefinition } from "../types";
import { ProcessDescription } from "pm2";

export interface ProcessManagerInterface {
  startProcess(scriptRoot: string, processDefinition: ProcessDefinition): PromiseLike<ProcessDescription>;
  stopProcess(processName: ProcessName): PromiseLike<ProcessDescription>;
  deleteProcess(processName: ProcessName): PromiseLike<ProcessDescription>;
  getProcessList(): PromiseLike<ProcessDescription[]>;
  getProcessDescription(processName: ProcessName): Promise<ProcessDescription>
}
