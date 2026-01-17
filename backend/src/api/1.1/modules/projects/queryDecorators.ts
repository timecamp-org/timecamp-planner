import { EntityStatus } from '../common/enum';
import { QueryModifier } from '../../../../services/types';
import { ProjectType } from '../db/schema';
import { Id } from '../common/identifier';
import Table from '../db/Table';
import { OrganizationProjectsQueryParams } from '../organizations/types';

import { get } from 'lodash';
import { BaseQueryFieldValue } from '../../../../infrastructure/resources/types';
import { parseCommaSeparatedQueryField } from '../../../../utils';

export const projectsExistsQueryModifier: QueryModifier = (query) =>
  query.andWhere('status', EntityStatus.EXISTS);

export const archivedProjectsQueryModifier: QueryModifier = (query) =>
  query.andWhere({
    status: EntityStatus.ARCHIVED,
    projectType: ProjectType.PROJECT,
  });

export const existingProjectsWithoutConversationsModifier: QueryModifier = (
  query
) =>
  query.andWhere({
    status: EntityStatus.EXISTS,
    projectType: ProjectType.PROJECT,
  });

export const projectsWithoutConversationsModifier: QueryModifier = (query) =>
  query.andWhere({
    projectType: ProjectType.PROJECT,
  });

export const conversationsModifier: QueryModifier = (query) =>
  query.whereIn('projectType', [
    ProjectType.DIRECT_CHAT,
    ProjectType.GROUP_CHAT,
  ]);

export const existingProjectsUserAssignedToModifier: (
  userId: Id
) => QueryModifier = (userId: Id) => (query) =>
  query.andWhere({
    [`${Table.PROJECT}.status`]: EntityStatus.EXISTS,
    [`${Table.USER_IN_PROJECT}.userId`]: userId,
    [`${Table.PROJECT}.projectType`]: ProjectType.PROJECT,
  });

export const existingProjectsAndConversationsUserAssignedToModifier: (
  userId: Id
) => QueryModifier = (userId: Id) => (query) =>
  query.andWhere({
    [`${Table.PROJECT}.status`]: EntityStatus.EXISTS,
    [`${Table.USER_IN_PROJECT}.userId`]: userId,
  });

export const unarchivedProjectModifier: QueryModifier = (query) =>
  query.where('isArchived', false);

export const getProjectsPeopleQueryModifier: (
  projectIds: Id[]
) => QueryModifier = (projectIds: Id[]) => (query) =>
  query
    .andWhere('status', EntityStatus.EXISTS)
    .andWhere(`${Table.PROJECT}.id`, 'in', projectIds);

export const getOrganizationProjectsQueryDecorator =
  (
    queryParams: OrganizationProjectsQueryParams,
    userIsOrganizationAdmin: boolean
  ) =>
  (decoratedQuery: QueryInterface): QueryBuilder => {
    const status = get(queryParams, 'status', EntityStatus.EXISTS);
    const projectTypes = parseCommaSeparatedQueryField<
      ProjectType | BaseQueryFieldValue
    >(queryParams, 'projectType', BaseQueryFieldValue.ALL);
    const isMember = get(queryParams, 'isMember', true);
    const isPrivate = get(queryParams, 'isPrivate', BaseQueryFieldValue.ALL);
    const getAllProjectTypes = projectTypes.includes(BaseQueryFieldValue.ALL);

    if (status !== BaseQueryFieldValue.ALL) {
      decoratedQuery.andWhere(`${Table.PROJECT}.status`, status);
    }

    if (isPrivate !== BaseQueryFieldValue.ALL) {
      decoratedQuery.andWhere(`${Table.PROJECT}.isPrivate`, isPrivate);
    }

    return decoratedQuery.andWhere(function () {
      if (projectTypes.includes(ProjectType.PROJECT) || getAllProjectTypes) {
        this.andWhere('projectType', ProjectType.PROJECT).andWhere(function () {
          if (isMember === true) {
            this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`);
          } else if (isMember === BaseQueryFieldValue.ALL) {
            if (!userIsOrganizationAdmin) {
              this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`).orWhere(
                'isPrivate',
                false
              );
            }
          } else {
            this.whereNull(`${Table.USER_IN_PROJECT}.userId`).andWhere(
              'isPrivate',
              false
            );
          }
        });
      }

      if (
        projectTypes.includes(ProjectType.DIRECT_CHAT) ||
        getAllProjectTypes
      ) {
        this.orWhere(function () {
          this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`).andWhere(
            'projectType',
            ProjectType.DIRECT_CHAT
          );
        });
      }

      if (projectTypes.includes(ProjectType.GROUP_CHAT) || getAllProjectTypes) {
        this.orWhere(function () {
          this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`).andWhere(
            'projectType',
            ProjectType.GROUP_CHAT
          );
        });
      }
    });
  };
