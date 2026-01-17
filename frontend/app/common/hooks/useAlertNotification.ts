import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import { useDispatch } from 'react-redux';

interface UseAlertNotificationInterface {
  id: string;
  kind?: HumanMessageKind;
}

export const useAlertNotification = ({
  id,
  kind = HumanMessageKind.success,
}: UseAlertNotificationInterface) => {
  const dispatch = useDispatch();

  return (message: string) =>
    dispatch(
      PopUpAlertsModelActions.onAddAlert(
        {
          humanMessage: HumanMessage({
            kind,
            text: message,
          }),
        },
        id
      )
    );
};
