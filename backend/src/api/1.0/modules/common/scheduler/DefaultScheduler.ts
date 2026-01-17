import { SchedulerInterface } from "./SchedulerInterface";
import { IntervalHandle, TimeoutHandle } from "./types";
import { injectable } from "inversify";
@injectable()
export class DefaultScheduler implements SchedulerInterface {
  clearInterval(handle: IntervalHandle) {
    clearInterval(handle);
  }

  clearTimeout(handle: TimeoutHandle) {
    clearTimeout(handle);
  }

  setInterval(intervalMs: number, callback: Function) : IntervalHandle {
    return setInterval(callback, intervalMs);
  }

  setTimeout(timeoutMs: number, callback: Function) : TimeoutHandle {
    return setTimeout(callback, timeoutMs);
  }
}
