import { List, Map } from 'immutable';
import { i18mark } from '../../../../i18n';
import { PlanStaticConfig } from '../models';
import { PlanStaticConfigRecordInterface, SubscriptionPlanId } from '../types';

const emptyList = List();

export default Map<string, PlanStaticConfigRecordInterface>({
  [SubscriptionPlanId.BASIC]: PlanStaticConfig({
    name: i18mark('Free'),
    recommendedAudience: i18mark('For small teams getting started'),
    hasMultiSeats: true,
    features: List([
      i18mark('Up to 5 users'),
      i18mark('Unlimited Projects and chats'),
      i18mark('10 Gb file storage (5 MB per file)'),
      i18mark('Board view'),
      i18mark('Due dates'),
      i18mark('Assignees'),
    ]),
    featuresAdditional: emptyList as List<string>,
  }),
  [SubscriptionPlanId.PRO_MONTHLY]: PlanStaticConfig({
    name: 'Premium',
    recommendedAudience: i18mark('For midsize teams and companies'),
    hasMultiSeats: true,
    features: List([
      i18mark('All the benefits of Free, and:'),
      i18mark('Unlimited file storage (100 MB per file)'),
      i18mark('Planner'),
      i18mark('Calendar'),
      i18mark('Timeline'),
      i18mark('My Tasks'),
      i18mark('Overwatch'),
      i18mark('Video calls'),
      i18mark('List view'),
      i18mark('Tags'),
    ]),
    featuresAdditional: emptyList as List<string>,
  }),
  [SubscriptionPlanId.PRO_YEARLY]: PlanStaticConfig({
    name: 'Premium',
    recommendedAudience: i18mark('For midsize teams and companies'),
    hasMultiSeats: true,
    features: List([
      i18mark('All the benefits of Free, and:'),
      i18mark('Unlimited file storage (100 MB per file)'),
      i18mark('Planner'),
      i18mark('Calendar'),
      i18mark('Timeline'),
      i18mark('My Tasks'),
      i18mark('Overwatch'),
      i18mark('Video calls'),
      i18mark('List view'),
      i18mark('Tags'),
    ]),
    featuresAdditional: emptyList as List<string>,
  }),
});
