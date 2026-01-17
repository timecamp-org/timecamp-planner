import { EntityType } from '../common/enum';

export const handleEntityDistanceSelector = (entityType, s) => {
  switch (entityType) {
    case EntityType.File:
      return `tbn.name <-> '${s}' asc, created_at desc `;
    case EntityType.Task:
      return `tbn.name <-> '${s}' asc, created_at desc `;
    case EntityType.Project:
      return `tbn.name <-> '${s}' asc, created_at desc `;
    case EntityType.Message:
      return `tbn.content <-> '${s}' asc, created_at desc `;
    case EntityType.User:
      return `tbn.last_name <-> '${s}' asc, tbn.last_name <-> '${s}' desc, created_at desc `;
    default:
      throw new Error(`Entity type ${entityType} not supported`);
  }
};
