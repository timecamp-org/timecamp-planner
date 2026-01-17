import { BaseWrappedActivity } from "../EntityModel/types";

export type ControlCommandActivityData = {
  type: string
}

export interface ControlCommandActivity extends BaseWrappedActivity {
  data: ControlCommandActivityData
}

export enum ControlCommandTypes {
  RESTART_APP = 'restart-app',
}
