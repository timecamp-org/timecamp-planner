import { TypedRecord } from "typed-immutable-record";

export enum HumanMessageKind {
  notSet = 'notSet',
  success = 'success',
  information = 'information',
  warning = 'warning',
  error = 'error',
}

export interface HumanMessageInterface {
  text: string,
  links?: Array<String>,
  kind: HumanMessageKind,
  submessages?: Object
}

export interface HumanMessageRecordInterface extends TypedRecord<HumanMessageRecordInterface>, HumanMessageInterface { }