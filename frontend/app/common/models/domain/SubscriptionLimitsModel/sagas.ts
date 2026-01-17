import { put, select } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import { List } from 'immutable';

import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';
import { selectSingleFileUploadLimit } from './selectors';
import { i18n } from '../../../i18n';

export function* filterFilesBySubscriptionLimits(files: File[]) {
  try {
    const singleFileUploadLimit = yield select((state) => selectSingleFileUploadLimit(state));
    if (!singleFileUploadLimit) {
      return files;
    }

    return files.filter((file) => file.size < singleFileUploadLimit);
  } catch (error) {
    handleError(error);
    return List();
  }
}

export function* handleFilesThatCantUpload(files: File[]) {
  try {
    const filesThatCantUploadNames = files.map((file) => file.name);

    for (let index = 0; index < filesThatCantUploadNames.length; index++) {
      const fileName = filesThatCantUploadNames[index];

      yield put(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: HumanMessage({
              kind: HumanMessageKind.warning,
              text: i18n.t(`Your attachment ({{fileName}}) is too large. In Premium it is not an issue! Upgrade now.`, {
                fileName,
              }),
            }),
          },
          null,
          false
        )
      );
    }
  } catch (error) {
    handleError(error);
  }
}
