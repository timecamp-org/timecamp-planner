import { Id, IdMap } from '../../common/identifier'
import {
  AbstractActivityContainerDbRow,
  AbstractActivityTargetDbRow,
  ActivityChangedPropDbRow,
  ActivityDbRow,
  ContainerType,
  TargetType
} from "../../db/schema";


export interface ActivityProviderInterface {
    /**
   * @param {Id} id
   * @returns {ActivityDbRow}
   */
  getActivity(id: Id, trx?: Transaction): PromiseLike<ActivityDbRow>

  /**
  * @param {Id} id
  * @returns {ActivityChangedPropDbRow[]}
  */
  getActivityChangedProps(id: Id, trx?: Transaction): PromiseLike<ActivityChangedPropDbRow[]>

    /**
   * @param {Id} id
   * @returns {ActivityTargetDbRow}
   */
  getActivityTarget<T extends AbstractActivityTargetDbRow>(id: Id, targetType: TargetType): PromiseLike<T>

  getActivityIdTargetIdMap(activities: ActivityDbRow[]): Promise<IdMap>

  /**
   * @param {Id} id
   * @returns {ActivityTargetDbRow}
   */
  getActivityContainer<T extends AbstractActivityContainerDbRow>(id: Id, containerType: ContainerType): PromiseLike<T>
}
