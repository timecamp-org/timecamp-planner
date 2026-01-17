import { TimeoutHandle, IntervalHandle } from "./types";

export interface SchedulerInterface
{
  setTimeout(timeoutMs: number, callback: Function) : TimeoutHandle;
  setInterval(intervalMs: number, callback: Function) : IntervalHandle;
  
  clearTimeout(handle: TimeoutHandle);
  clearInterval(handle: IntervalHandle);
}
