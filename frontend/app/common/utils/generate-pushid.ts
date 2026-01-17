import uuid from 'uuid/v4'
import { Id } from './identifier';

export default function (): Id {
  return uuid()
}
