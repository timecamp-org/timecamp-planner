import { ChainElementFilter, ChangedPropertyPredicate } from "./types";
import { ChainableContextInterface } from "../interfaces/ChainableContextInterface";
import { NotificationType } from "../types";
import { NotificationData } from '../../db/schema';

/**
 * Helper class (helper methods actually) so that there is no need
 * to write filter funcitons by hand, and that provides a clean and
 * easy to read filter declaration (see: NotificationDefinitions).
 */
export class Filter {
  public static or(...predicates: ChainElementFilter[]): ChainElementFilter {
    return (ctx: ChainableContextInterface) => {
      for (let p of predicates) {
        if (p(ctx) === true) {
          return true;
        }
      }
      return false;
    }
  }

  public static and(...predicates: ChainElementFilter[]): ChainElementFilter {
    return (ctx: ChainableContextInterface) => {
      for (let p of predicates) {
        if (p(ctx) !== true) {
          return false;
        }
      }
      return true;
    }
  }

  public static not(predicate: ChainElementFilter): ChainElementFilter {
    return (ctx: ChainableContextInterface) => {
      return !predicate(ctx);
    }
  }

  /**
   * Returns true if notification is of given type.
   *
   * @param {NotificationType} notificationType
   * @return {ChainElementFilter}
   */
  public static type(notificationType: NotificationType): ChainElementFilter {
    return (ctx: ChainableContextInterface) => ctx.getNotification().notificationType === notificationType;
  }

  /**
   * Allows checking for changed property value. If no predicate is provided then it assumes that
   * predicate is: 'property has been changed in whatever way'.
   *
   * @param {keyof T} propertyName
   * @param {ChangedPropertyPredicate} predicate
   * @return {ChainElementFilter}
   */
  public static propertyChanged<T>(propertyName: keyof T, predicate?: ChangedPropertyPredicate): ChainElementFilter {
    if (!predicate) {
      predicate = changedProp => !!changedProp;
    }
    return (ctx: ChainableContextInterface) => {
      const propertyChanged = ctx.getChangedProperty(propertyName);
      if (!propertyChanged) {
        // Property has not been changed.
        return false;
      }
      return predicate(propertyChanged);
    }
  }


  /**
   * Returns true if notificationData[propertyName] is any of the following:
   *  - empty string
   *  - null
   *  - undefined
   * @param propertyName
   */
  public static propertyEmpty(propertyName: keyof NotificationData) : ChainElementFilter {
    return (ctx: ChainableContextInterface) => {
      const data = ctx.getData();
      if (typeof data[propertyName] === 'undefined') {
        // As promised: true if undefined
        return true;
      }
      const value = data[propertyName];
      return value === '' || value === null;
    }
  }
}
