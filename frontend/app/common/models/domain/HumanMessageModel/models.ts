import { makeTypedFactory } from 'typed-immutable-record'

import { HumanMessageInterface, HumanMessageRecordInterface, HumanMessageKind } from './types'

const defaultHumanMessage: HumanMessageInterface = {
  text: '[human readable text not set]',
  links: [],
  kind: HumanMessageKind.notSet,
  submessages: {},
}

export const HumanMessage = makeTypedFactory<
  HumanMessageInterface | HumanMessageRecordInterface,
  HumanMessageRecordInterface
> ( defaultHumanMessage );