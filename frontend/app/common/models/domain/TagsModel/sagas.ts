import { put, select, fork, takeEvery, takeLatest, cps, call } from 'redux-saga/effects';
import generateId from '../../../utils/generate-pushid';
import { Tag } from './models';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';
import { tagsColors } from '../../../commonStyles/colors';
import { HeySpaceClient as client, UserTracker } from '../../../services';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';

import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import * as A from './actions';
import * as C from './constants';
import * as S from './selectors';

import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import { TagInterface } from './types';
import { Id } from '../../../utils/identifier';
import { PartialPayloadAction } from '../../../types';

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onInit, onInit);
    });
    yield fork(function* () {
      yield takeEvery(C.onTagCreate, onTagCreate);
    });
    yield fork(function* () {
      yield takeEvery(C.onDeleteTag, onDeleteTag);
    });
    yield fork(function* () {
      yield takeEvery(C.onUpdateTagName, onUpdateTagName);
    });
    yield fork(function* () {
      yield takeEvery(C.onUpdateTagColor, onUpdateTagColor);
    });
    yield fork(function* () {
      yield takeEvery(C.onTagAttach, onTagAttach);
    });
    yield fork(function* () {
      yield takeEvery(C.onTagDetach, onTagDetach);
    });
    yield fork(function* () {
      yield takeEvery(C.onTagsDetach, onTagsDetach);
    });
    yield fork(function* () {
      yield takeEvery(C.onTagAssign, onTagAssign);
    });
  },
];

export function* onInit() {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizationTags, organizationId, RequestStatus.LOADING));

    const tags: TagInterface[] = yield cps(client.restApiClient.getOrganizationTags, organizationId);
    yield put(A.onBatchTagsData(tags));
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizationTags, organizationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(RequestTypesConstants.getOrganizationTags, organizationId, RequestStatus.FAILURE, error)
    );
  }
}

function* onTagCreate({ payload }: PartialPayloadAction) {
  const id = payload.id || generateId();
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createTag, id, RequestStatus.LOADING));

    const organizationId = yield select(selectCurrentOrganizationId);
    const rawTagFields: TagInterface = {
      id,
      color: payload.color || tagsColors[Math.floor(Math.random() * tagsColors.length)],
      organizationId,
      name: payload.name,
    };
    const tag = Tag(rawTagFields);

    yield put(
      A.onTagCreateSuccess(
        makeActionResult({
          isOk: true,
          code: 'onTagCreateSuccess',
          data: { tag },
        })
      )
    );

    yield cps(client.restApiClient.createTag, tag.id, tag.toJS());
    yield put(onSetRequestStatus(RequestTypesConstants.createTag, id, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { payload });
    yield put(onSetRequestStatus(RequestTypesConstants.createTag, id, RequestStatus.FAILURE, error));
  }
}

function* onDeleteTag({ payload: tagId }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteTag, tagId, RequestStatus.LOADING));

    yield cps(client.restApiClient.deleteTag, tagId);

    yield put(onSetRequestStatus(RequestTypesConstants.deleteTag, tagId, RequestStatus.SUCCESS));

    yield put(
      A.onDeleteTagSuccess(
        makeActionResult({
          isOk: true,
          code: 'onDeleteTagSuccess',
          data: { tagId },
        })
      )
    );
  } catch (error) {
    handleError(error, { tagId });
    yield put(onSetRequestStatus(RequestTypesConstants.deleteTag, tagId, RequestStatus.FAILURE, error));
  }
}

function* onUpdateTagName({ payload: { tagId, name } }: PartialPayloadAction) {
  try {
    yield call(onTagUpdate, tagId, { name });
  } catch (error) {
    handleError(error);
  }
}

function* onUpdateTagColor({ payload: { tagId, color } }: PartialPayloadAction) {
  try {
    yield call(onTagUpdate, tagId, { color });
  } catch (error) {
    handleError(error);
  }
}

function* onTagAttach({ payload: { objectId, tagId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.attachTagToTask, tagId, RequestStatus.LOADING));

    yield put(
      A.onTagAttachSuccess(
        makeActionResult({
          isOk: true,
          code: 'onTagAttachSuccess',
          data: { objectId, tagId },
        })
      )
    );

    yield cps(client.restApiClient.attachTagToTask, objectId, tagId);

    UserTracker.track(UserTrackerEvent.cardEdited, { what: 'tag-added' });
    yield put(onSetRequestStatus(RequestTypesConstants.attachTagToTask, tagId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { tagId });
    yield put(onSetRequestStatus(RequestTypesConstants.attachTagToTask, tagId, RequestStatus.FAILURE, error));
  }
}

function* onTagsDetach({ payload: { objectId } }: PartialPayloadAction) {
  try {
    const tagIds = (yield select((state) => S.selectTagList(state, { objectId }))).toArray().map((tag) => tag.id);

    for (const tagId of tagIds) {
      yield call(onTagDetach, { payload: { objectId, tagId } });
    }
  } catch (error) {
    handleError(error, { objectId });
  }
}

function* onTagDetach({ payload: { objectId, tagId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.detachTagFromTask, tagId, RequestStatus.LOADING));

    yield put(
      A.onTagDetachSuccess(
        makeActionResult({
          isOk: true,
          code: 'onTagDetachSuccess',
          data: { objectId, tagId },
        })
      )
    );

    yield cps(client.restApiClient.detachTagFromTask, objectId, tagId);
    yield put(onSetRequestStatus(RequestTypesConstants.detachTagFromTask, tagId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { objectId, tagId });
    yield put(onSetRequestStatus(RequestTypesConstants.detachTagFromTask, tagId, RequestStatus.FAILURE, error));
  }
}

function* onTagAssign({ payload: { objectId, name } }: PartialPayloadAction) {
  try {
    const immutableTag = yield select(S.selectTagByName, { name });

    if (immutableTag) {
      const tagId = immutableTag.get('id');
      yield put(A.onTagAttach(objectId, tagId));
    } else {
      const tagId = generateId();
      const tagFields = { id: tagId, name };
      yield call(onTagCreate, { payload: tagFields });
      yield put(A.onTagAttach(objectId, tagId));
    }
  } catch (error) {
    handleError(error, { objectId, name });
  }
}

function* onTagUpdate(tagId: Id, tagFields: Partial<TagInterface>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateTag, tagId, RequestStatus.LOADING));

    yield cps(client.restApiClient.updateTag, tagId, tagFields);
    yield put(onSetRequestStatus(RequestTypesConstants.updateTag, tagId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateTag, tagId, RequestStatus.FAILURE, error));
  }
}
